from diffusers import AutoencoderKL
from unet_motion_model import MotionAdapter
from diffusers.pipelines import DiffusionPipeline, StableDiffusionPipeline
from diffusers.schedulers import DPMSolverMultistepScheduler
from controlnet import ControlNetModel
from upscale import upscale
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download
from diffusers.utils import load_image
from embed_manager import EmbedManager
from tqdm import tqdm
import logging
import torch
import math

logger = logging.getLogger(__name__)


def get_chunk_windows(n: int, window_size: int, overlap: int):
    """
    Get overlapping windows of frames

    :param n: number of frames
    :param window_size: size of the window
    :param overlap: overlap between windows
    :return: list of ranges
    """
    ranges = [
        range(i, i + window_size)
        for i in range(0, n - window_size + 1, window_size - overlap)
    ]
    if len(ranges) == 0:
        ranges.append(range(0, n))
    elif ranges[-1][-1] != n - 1:
        ranges.append(range(ranges[-1][-1] - overlap, n))
    return ranges


def generate_freenoise_latents(n: int, generator: torch.Generator):
    """
    Generate latents acording to the FreeNoise paper
    :return: latents
    """

    # Default params from paper
    overlap = 4
    window_size = 16

    # Round up to the nearest window size
    n_rounded = math.ceil(n / window_size) * window_size

    # Generate completely random latents
    latents = torch.randn(
        [1, 4, n_rounded, 64, 114],
        device="cuda",
        dtype=torch.float16,
        generator=generator,
    )
    for frame_index in range(window_size, n_rounded, overlap):
        list_index = torch.tensor(
            list(range(frame_index - 16, frame_index + overlap - window_size)),
            device="cuda",
        )
        list_index = list_index[
            torch.randperm(len(list_index), generator=generator, device="cuda")
        ]
        # print("list_index", list_index)
        latents[:, :, frame_index : frame_index + overlap] = latents[:, :, list_index]
    return latents[:, :, :n, :, :]


def create_pipeline(args):
    logger.info("Loading AnimateDiff motion adapter")
    adapter = MotionAdapter().to("cuda", torch.float16)
    adapter.load_state_dict(
        load_file(
            hf_hub_download(
                args.motion_adapter,
                args.motion_adapter_variant,
            ),
            device="cuda",
        )
    )

    logger.info("Loading ControlNet")
    controlnet = [
        ControlNetModel.from_pretrained(
            "lllyasviel/control_v11p_sd15_openpose", torch_dtype=torch.float16
        ),
    ]

    logger.info("Loading VAE")
    vae = AutoencoderKL.from_pretrained(
        "stabilityai/sd-vae-ft-mse", torch_dtype=torch.float16
    )
    vae.enable_slicing()

    logger.info("Creating diffusion pipeline")
    pipe = DiffusionPipeline.from_pretrained(
        args.model,
        motion_adapter=adapter,
        controlnet=controlnet,
        vae=vae,
        custom_pipeline="./pipeline.py",
    ).to(device="cuda", dtype=torch.float16)

    logger.info("Setting up scheduler")
    pipe.scheduler = DPMSolverMultistepScheduler.from_pretrained(
        args.model,
        subfolder="scheduler",
        clip_sample=False,
        timestep_spacing="linspace",
        steps_offset=1,
        beta_schedule="linear",
        final_sigmas_type="sigma_min",
    )

    if args.model_ip_adapter:
        logger.info("Loading IP adapter")
        pipe.load_ip_adapter(
            "h94/IP-Adapter",
            subfolder="models",
            weight_name=["ip-adapter_sd15.safetensors"],
        )
        pipe.set_ip_adapter_scale([args.ip_adapter_scale])

    logger.info("Loading motion LoRA adapters")
    pipe.load_lora_weights(
        "guoyww/animatediff-motion-lora-pan-left",
        adapter_name="left",
    )
    pipe.load_lora_weights(
        "guoyww/animatediff-motion-lora-pan-right",
        adapter_name="right",
    )
    pipe.load_lora_weights(
        "guoyww/animatediff-motion-lora-tilt-up",
        adapter_name="up",
    )
    pipe.load_lora_weights(
        "guoyww/animatediff-motion-lora-tilt-down",
        adapter_name="down",
    )
    # Disable LoRA adapters - they are managed by chunked motion adapter
    pipe.set_adapters([], adapter_weights=[])
    pipe.enable_vae_slicing()

    return pipe

def create_pipeline_ip(args):
    pipe = StableDiffusionPipeline.from_pretrained(
        args.model_ip_adapter, torch_dtype=torch.float16
    ).to("cuda")
    return pipe

def generate_scene(pipe, args, conditioning_frames, scenario, lengths):
    logger.info("Generating IP image")
    ip_pipe = create_pipeline_ip(args)
    ip_image = ip_pipe(scenario["character_description"]).images[0]
    # Save ip image for debug
    # TODO: Remove this
    ip_image.save("ip.jpg")
    # Delete pipeline for memory
    del ip_pipe

    embed_manager = EmbedManager(
        lengths[-1],
        scenario["character_description"],
        pipe.tokenizer,
        pipe.text_encoder,
    )
    prompts = [
        (scene["scene_description"], scene["motion_description"], length // 2)
        for scene, length in zip(scenario["actions"], lengths)
    ]
    embed_manager.precompute_embeds(prompts)

    n = len(conditioning_frames[1])
    embeds = embed_manager.get_embed_window(0, n)
    negative_embeds = embed_manager.get_negative_embeds()

    logger.info("Generating video")
    with torch.no_grad():
        generator = torch.Generator(device="cuda")
        if args.seed:
            generator = generator.manual_seed(args.seed)

        # Generate latents
        latents = generate_freenoise_latents(n, generator)

        # Create overlapping ranges for classic chunked inference
        ranges = get_chunk_windows(n, 64, 4)

        # Inference
        with tqdm(total=(args.steps * len(ranges))) as bar:
            for step in range(0, args.steps):
                # New latents for this step
                sum_latents = torch.zeros_like(
                    latents, device="cuda", dtype=torch.float16
                )
                num_processed = torch.zeros([n], device="cuda", dtype=torch.float16)

                # Chunked inference
                for r in ranges:
                    result = pipe(
                        prompt_embeds=embeds[r],
                        ip_adapter_image=[ip_image],
                        negative_prompt_embeds=negative_embeds[r],
                        width=912,
                        height=512,
                        guidance_scale=args.guidance_scale,
                        conditioning_frames=[[conditioning_frames[1][i] for i in r]],
                        num_inference_steps=args.steps,
                        num_frames=len(r),
                        steps_offset=step,
                        do_inference_steps=1,
                        generator=generator,
                        latents=latents[:, :, r, :, :],
                        controlnet_conditioning_scale=[1.0],
                        camera_motions=[conditioning_frames[0][i] for i in r],
                        output_type="latent",
                    )
                    # Update immediate latents
                    sum_latents[:, :, r, :, :] += result.frames
                    num_processed[r] += 1

                    # Update progress bar
                    bar.update()

                # Average the latents to create the next input
                latents = sum_latents / num_processed.view(1, 1, n, 1, 1)

        # Decode the latents to video
        logger.info("Decoding latents")
        frames = pipe.decode_latents(latents)
        video = pipe.tensor2vid(frames, "pil")[0]

        # Return final upscaled video and IP image
        return (upscale(video), ip_image)
