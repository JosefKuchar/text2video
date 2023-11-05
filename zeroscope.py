import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.utils import export_to_video
from PIL import Image
import os
import fileinput

# Base model
pipe = DiffusionPipeline.from_pretrained("cerspense/zeroscope_v2_576w", torch_dtype=torch.float16)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe.enable_model_cpu_offload()
pipe.enable_vae_slicing()
#pipe.unet.enable_forward_chunking(chunk_size=1, dim=1) # disable if enough memory as this slows down significantly

# Upscale
pipe_upscale = DiffusionPipeline.from_pretrained("cerspense/zeroscope_v2_XL", torch_dtype=torch.float16)
pipe_upscale.scheduler = DPMSolverMultistepScheduler.from_config(pipe_upscale.scheduler.config)
pipe_upscale.enable_model_cpu_offload()
pipe_upscale.enable_vae_slicing()

for prompt in fileinput.input():
    prompt = prompt.strip()
    print(prompt)
    output_dir = f"./outputs/{prompt}"
    os.makedirs(output_dir, exist_ok=True)

    video_frames = pipe(prompt, num_inference_steps=40, height=320, width=576, num_frames=36).frames
    video_path = export_to_video(video_frames)

    video = [Image.fromarray(frame).resize((1024, 576)) for frame in video_frames]

    video_frames = pipe_upscale(prompt, video=video, strength=0.6).frames
    video_path = export_to_video(video_frames, output_video_path=f"{output_dir}/{prompt}.mp4")
