import torch
from diffusers import StableVideoDiffusionPipeline, DiffusionPipeline
from diffusers.utils import load_image, export_to_video
import argparse
import json
import os

def generate_images(config, dir):
    os.makedirs(os.path.join(dir, 'images'), exist_ok=True)

    # https://huggingface.co/docs/diffusers/using-diffusers/sdxl
    # Setup pipes
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

    images = []
    for index, image in enumerate(config):
        prompt = image['text2image']
        size = (1280, 720) # I2VGen-XL resolution

        # Run inference
        image = base(
            prompt=prompt,
            num_inference_steps=25,
            denoising_end=0.8,
            output_type="latent",
            original_size=size,
            target_size=size,
            width=size[0],
            height=size[1],
        ).images
        image = refiner(
            prompt=prompt,
            num_inference_steps=25,
            denoising_start=0.8,
            image=image,
            original_size=size,
            target_size=size,
            width=size[0],
            height=size[1],
        ).images[0]

        # Save image
        relative_path = os.path.join('images', f'{index}.png')
        image.save(os.path.join(dir, relative_path))
        images.append(relative_path)
    return images

def load_config(dir):
    with open(os.path.join(dir, 'text.json'), 'r') as f:
        return json.load(f)

def save_image_config(images, dir):
    with open(os.path.join(dir, 'images.json'), 'w') as f:
        json.dump(images, f)

if __name__ == '__main__':
    # TODO: Description
    parser = argparse.ArgumentParser()
    parser.add_argument('dir', type=str, help='Directory to save the output')
    args = parser.parse_args()
    config = load_config(args.dir)
    images = generate_images(config, args.dir)
    save_image_config(images, args.dir)
