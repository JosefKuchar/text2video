from diffusers import AutoencoderKL, ControlNetModel
from unet_motion_model import MotionAdapter
from diffusers.pipelines import DiffusionPipeline
from diffusers.schedulers import DPMSolverMultistepScheduler
from upscale import upscale
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download
from diffusers.utils import load_image
from embed_manager import EmbedManager
import logging
import random
import torch
import imageio
from PIL import Image

logger = logging.getLogger(__name__)


def generate_video(args, conditioning_frames, scenario, lengths):
    n = 128

    logger.info("Loading AnimateDiff motion adapter")
    adapter = MotionAdapter().to("cuda", torch.float16)
    adapter.load_state_dict(
        load_file(
            hf_hub_download(
                "ByteDance/AnimateDiff-Lightning",
                "animatediff_lightning_4step_diffusers.safetensors",
            ),
            device="cuda",
        )
    )

    logger.info("Loading ControlNet")
    controlnet = [
        ControlNetModel.from_pretrained(
            "lllyasviel/control_v11p_sd15_openpose", torch_dtype=torch.float16
        ),
        # ControlNetModel.from_pretrained(
        #     "lllyasviel/control_v11f1p_sd15_depth", torch_dtype=torch.float16
        # ),
    ]

    logger.info("Loading VAE")
    vae = AutoencoderKL.from_pretrained(
        "stabilityai/sd-vae-ft-mse", torch_dtype=torch.float16
    )
    vae.enable_slicing()

    depth_img = Image.open("data/ground.png")

    logger.info("Creating diffusion pipeline")
    model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
    pipe = DiffusionPipeline.from_pretrained(
        model_id,
        motion_adapter=adapter,
        controlnet=controlnet,
        vae=vae,
        custom_pipeline="./pipeline.py",
    ).to(device="cuda", dtype=torch.float16)

    embed_manager = EmbedManager(lengths[-1], pipe.tokenizer, pipe.text_encoder)
    prompts = [
        (scene["scene_description"], length // 2)
        for scene, length in zip(scenario["scenes"], lengths)
    ]
    print(prompts)
    embed_manager.precompute_embeds(prompts)

    logger.info("Setting up scheduler")
    # pipe.scheduler = EulerDiscreteScheduler.from_config(
    #     pipe.scheduler.config, timestep_spacing="trailing", beta_schedule="linear"
    # )
    pipe.scheduler = DPMSolverMultistepScheduler.from_pretrained(
        model_id,
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
    #     weight_name="ip-adapter_sd15.safetensors",
    # )
    # pipe.set_ip_adapter_scale(0.7)

    # style_folder = (
    #     "https://huggingface.co/datasets/YiYiXu/testing-images/resolve/main/style_ziggy"
    # )
    # style_images = [load_image(f"{style_folder}/img{i}.png") for i in range(10)]

    # pipe.load_lora_weights("lora/Willie.safetensors", 'willie')
    # pipe.set_adapters(["willie"], adapter_weights=[0.8])
    pipe.enable_vae_slicing()

    embeds = embed_manager.get_embed_window(0, len(conditioning_frames))
    print("embeds", embeds.shape)
    embeds = embeds[0:n]
    print("embeds", embeds.shape)

    logger.info("Generating video")
    with torch.no_grad():
        generator = torch.Generator(device="cuda")
        if args.seed:
            generator.manual_seed(args.seed)
        steps = 5
        overlap = 4
        window_size = 16
        latents = torch.randn(
            [1, 4, n, 64, 64], device="cuda", dtype=torch.float16, generator=generator
        )
        for frame_index in range(window_size, n, overlap):
            list_index = list(
                range(frame_index - 16, frame_index + overlap - window_size)
            )
            random.shuffle(list_index)
            latents[:, :, frame_index : frame_index + overlap] = latents[
                :, :, list_index
            ]
        result = pipe(
            prompt_embeds=embeds,
            # ip_adapter_image=style_images,
            width=512,
            height=512,
            guidance_scale=1.0,
            do_inference_steps=5,
            steps_offset=0,
            conditioning_frames=[
                conditioning_frames[0:n],
                [depth_img] * n,
            ],
            num_inference_steps=steps,
            num_frames=n,
            generator=generator,
            latents=latents,
            output_type="latent",
            controlnet_conditioning_scale=[1.0],
        )
        frames = pipe.decode_latents(result.frames)
        video = pipe.tensor2vid(frames, "pil")[0]
        imageio.mimsave("result.mp4", video, fps=10, codec="libx264")
        if not args.skip_upscaling:
            video = upscale(video)
            imageio.mimsave("result_upscaled.mp4", video, fps=10, codec="libx264")
