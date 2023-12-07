import torch

from diffusers import StableVideoDiffusionPipeline, DiffusionPipeline
from diffusers.utils import load_image, export_to_video

base = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
).to("cuda")

refiner = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-refiner-1.0",
    text_encoder_2=base.text_encoder_2,
    vae=base.vae,
    torch_dtype=torch.float16,
    use_safetensors=True,
    variant="fp16",
).to("cuda")

pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt", torch_dtype=torch.float16, variant="fp16"
)
pipe.enable_model_cpu_offload()

# Load the conditioning image
#image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/svd/rocket.png?download=true")
#image = image.resize((1024, 576))

prompt = "Photo of moving train at night"

image = base(
    prompt=prompt,
    num_inference_steps=25,
    denoising_end=0.8,
    output_type="latent",
    width=1024,
    height=576
).images
image = refiner(
    prompt=prompt,
    num_inference_steps=25,
    denoising_start=0.8,
    image=image,
    width=1024,
    height=576
).images[0]

generator = torch.manual_seed(21)
# frames = pipe(image, decode_chunk_size=8, generator=generator).frames[0]
frames = pipe(image, decode_chunk_size=8).frames[0]

export_to_video(frames, "generated.mp4", fps=7)
