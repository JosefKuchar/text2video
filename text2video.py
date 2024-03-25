import torch
from diffusers import AutoencoderKL, ControlNetModel, MotionAdapter
from diffusers.pipelines import DiffusionPipeline
from diffusers.schedulers import DPMSolverMultistepScheduler
from PIL import Image
import imageio
from upscale import upscale
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download
from conditioning import generate_conditioning_frames
import diffusers
import warnings
from priorMDM.infer import main
import coloredlogs

if __name__ == "__main__":
    # Disable some warnings
    warnings.filterwarnings("ignore", category=FutureWarning)
    warnings.filterwarnings("ignore", category=UserWarning)

    # Set up logging
    coloredlogs.DEFAULT_LOG_FORMAT = (
        "%(asctime)s %(hostname)s %(name)s %(levelname)s %(message)s"
    )
    coloredlogs.install(level="INFO")
    diffusers.logging.set_verbosity_error()

    results = main(["A person is doing backflip", "A person is throwing a ball"])
    motion = results["motion"][0]
    conditioning_frames = generate_conditioning_frames(
        motion=motion, start=0, stop=280, step=2
    )

    # Save the conditioning frames
    imageio.mimsave("conditioning.mp4", conditioning_frames, fps=8, codec="libx264")

    # motion_id = "guoyww/animatediff-motion-adapter-v1-5-2"
    # adapter = MotionAdapter.from_pretrained(motion_id)

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

    controlnet = [
        ControlNetModel.from_pretrained(
            "lllyasviel/control_v11p_sd15_openpose", torch_dtype=torch.float16
        ),
        # ControlNetModel.from_pretrained(
        #     "lllyasviel/control_v11f1p_sd15_depth", torch_dtype=torch.float16
        # ),
    ]
    vae = AutoencoderKL.from_pretrained(
        "stabilityai/sd-vae-ft-mse", torch_dtype=torch.float16
    )
    vae.enable_slicing()

    depth_img = Image.open("data/ground.png")

    model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
    pipe = DiffusionPipeline.from_pretrained(
        model_id,
        motion_adapter=adapter,
        controlnet=controlnet,
        vae=vae,
        custom_pipeline="./pipeline_animatediff_controlnet.py",
    ).to(device="cuda", dtype=torch.float16)
    pipe.scheduler = DPMSolverMultistepScheduler.from_pretrained(
        model_id,
        subfolder="scheduler",
        clip_sample=False,
        timestep_spacing="linspace",
        steps_offset=1,
        beta_schedule="linear",
        final_sigmas_type="sigma_min",
    )
    # pipe.load_lora_weights("lora/Willie.safetensors", 'willie')
    # pipe.load_lora_weights(
    #     "guoyww/animatediff-motion-lora-zoom-out", adapter_name="zoom-out",
    # )
    # pipe.load_lora_weights(
    #     "guoyww/animatediff-motion-lora-pan-left", adapter_name="pan-left",
    # )
    # pipe.set_adapters(["zoom-out", "pan-left"], adapter_weights=[1.0, 1.0])
    # pipe.set_adapters(["willie"], adapter_weights=[0.8])
    pipe.enable_vae_slicing()

    prompt = "ironman is walking on the street, holding a shield"
    negative_prompt = "bad quality, worst quality"

    torch.manual_seed(1234)
    with torch.no_grad():
        generator = torch.Generator(device="cuda")
        generator.manual_seed(1234)
        steps = 5
        n = 128
        overlap = 4
        window_size = 16
        latents = torch.randn(
            [1, 4, 16, 64, 64], device="cuda", dtype=torch.float16, generator=generator
        )
        latents = latents.repeat(1, 1, 8, 1, 1)
        # ranges = [range(0, 16), range(8, 24), range(16, 32), [24,25,26,27,28,29,30,31,0,1,2,3,4,5,6,7], range(0, 32, 2), range(1, 32, 2)] # range(0, 32, 2), range(1, 32, 2)
        # Calculate ranges based on n, overlap and window_size
        ranges = [
            range(i, i + window_size)
            for i in range(0, n - window_size + 1, window_size - overlap)
        ]
        print(ranges)
        for step in range(0, steps):
            sum_latents = torch.zeros(
                [1, 4, n, 64, 64], device="cuda", dtype=torch.float16
            )
            num_processed = torch.zeros([n], device="cuda", dtype=torch.float16)
            for r in ranges:
                result = pipe(
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    width=512,
                    height=512,
                    guidance_scale=1.0,
                    do_inference_steps=1,
                    steps_offset=step,
                    conditioning_frames=[
                        [conditioning_frames[i] for i in r],
                        [depth_img] * len(r),
                    ],
                    num_inference_steps=steps,
                    num_frames=len(r),
                    generator=generator,
                    latents=latents[:, :, r, :, :],
                    output_type="latent",
                    controlnet_conditioning_scale=[1.0],
                )
                weight = 1
                sum_latents[:, :, r, :, :] += result.frames * weight
                num_processed[r] += weight
            latents = sum_latents / num_processed.view(1, 1, n, 1, 1)
        frames = pipe.decode_latents(latents)
        video = pipe.tensor2vid(frames, "pil")[0]
        imageio.mimsave("result.mp4", video, fps=8, codec="libx264")
        video = upscale(video)
        imageio.mimsave("result_upscaled.mp4", video, fps=8, codec="libx264")
