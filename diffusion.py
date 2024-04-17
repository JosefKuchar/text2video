from diffusers import AutoencoderKL
from unet_motion_model import MotionAdapter
from diffusers.pipelines import DiffusionPipeline
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
import imageio
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
        ranges.append(range(0,n))
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


def generate_video(args, conditioning_frames, scenario, lengths):
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
        # image_encoder=image_encoder,
    ).to(device="cuda", dtype=torch.float16)

    embed_manager = EmbedManager(
        lengths[-1],
        scenario["character_description"],
        pipe.tokenizer,
        pipe.text_encoder,
    )
    prompts = [
        (scene["scene_description"], scene["motion_description"], length // 2)
        for scene, length in zip(scenario["scenes"], lengths)
    ]
    embed_manager.precompute_embeds(prompts)

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

    # logger.info("Loading IP adapter")
    # pipe.load_ip_adapter(
    #     "h94/IP-Adapter",
    #     subfolder="models",
    #     weight_name=["ip-adapter_sd15.safetensors", "ip-adapter-full-face_sd15.bin"],
    # )
    # pipe.set_ip_adapter_scale([0.7, 0.3])

    # logger.info("Loading IP adapter")
    # pipe.load_ip_adapter(
    #     "h94/IP-Adapter",
    #     subfolder="models",
    #     weight_name=["ip-adapter_sd15.safetensors"],
    # )
    # pipe.set_ip_adapter_scale([0.7])

    # style_folder = (
    #     "https://huggingface.co/datasets/YiYiXu/testing-images/resolve/main/style_ziggy"
    # )
    # face_image = [
    #     load_image(
    #         "https://huggingface.co/datasets/YiYiXu/testing-images/resolve/main/women_input.png"
    #     )
    # ]
    # style_images = [load_image(f"{style_folder}/img{i}.png") for i in range(10)]

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

    # pipe.load_lora_weights("lora/Willie.safetensors", "willie")
    # pipe.set_adapters(["willie"], adapter_weights=[0.9])
    pipe.enable_vae_slicing()

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
                        negative_prompt_embeds=negative_embeds[r],
                        # ip_adapter_image=style_images,
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
        frames = pipe.decode_latents(latents)
        video = pipe.tensor2vid(frames, "pil")[0]

        # Save the video
        imageio.mimsave("result.mp4", video, fps=10, codec="libx264")
        if not args.skip_upscaling:
            video = upscale(video)
            imageio.mimsave("result_upscaled.mp4", video, fps=10, codec="libx264")
