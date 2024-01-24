import torch
from diffusers import DiffusionPipeline
from transformers import CLIPProcessor, CLIPModel
import argparse
import json
import os

def generate_images(config, dir):
    os.makedirs(os.path.join(dir, 'images'), exist_ok=True)
    os.makedirs(os.path.join(dir, 'images-debug'), exist_ok=True)

    # https://huggingface.co/docs/diffusers/using-diffusers/sdxl
    # Setup pipes
    base = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
    ).to("cuda")
    base.enable_vae_slicing()
    refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=base.text_encoder_2,
        vae=base.vae,
        torch_dtype=torch.float16,
        use_safetensors=True,
        variant="fp16",
    ).to("cuda")
    refiner.enable_vae_slicing()

    # https://huggingface.co/openai/clip-vit-large-patch14
    clip_model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")
    clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")

    data = []

    # Set seed for reproducibility
    torch.manual_seed(0)
    for index, image in enumerate(config):
        prompt = image['text2image']
        style_prompt = "animated cartoon"
        steps = 40
        batch_size = 4
        negative_prompt = "multiple scenes, multiple images, vector, out of frame, lowres, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature"
        size = (1280, 720) # I2VGen-XL resolution

        # Run inference
        images = base(
            prompt=prompt,
            prompt_2=style_prompt,
            negative_prompt=negative_prompt,
            negative_prompt_2=negative_prompt,
            num_inference_steps=steps,
            denoising_end=0.8,
            output_type="latent",
            original_size=size,
            target_size=size,
            width=size[0],
            height=size[1],
            num_images_per_prompt=batch_size,
        ).images
        images = refiner(
            prompt=prompt,
            prompt_2=style_prompt,
            negative_prompt=negative_prompt,
            nsegative_prompt_2=negative_prompt,
            num_inference_steps=steps,
            denoising_start=0.8,
            image=images,
            original_size=size,
            target_size=size,
            width=size[0],
            height=size[1],
            num_images_per_prompt=batch_size,
        ).images

        # Calculate similarity
        inputs = clip_processor(text=prompt, images=images, return_tensors="pt", padding=True)
        outputs = clip_model(**inputs)
        logits = outputs.logits_per_text
        probs = logits.oftmax(dim=1)
        best = probs[0].argmax()
        print("Best image:", best, "with probability:", probs[0][best].item())

        # Save all images for debugging
        for i, image in enumerate(images):
            relative_path = os.path.join('images-debug', f'{index}-{i}.png')
            image.save(os.path.join(dir, relative_path))

        # Save best image
        image = images[best]
        relative_path = os.path.join('images', f'{index}.png')
        image.save(os.path.join(dir, relative_path))
        data.append(relative_path)
    return data

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
