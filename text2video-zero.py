import torch
from model import Model
import os
import fileinput

model = Model(device = "cuda", dtype = torch.float16)

for prompt in fileinput.input():
    prompt = prompt.strip()
    print(prompt)
    output_dir = f"./outputs/{prompt}/"
    os.makedirs(output_dir, exist_ok=True)

    params = {"t0": 44, "t1": 47 , "motion_field_strength_x" : 12, "motion_field_strength_y" : 12, "video_length": 8}

    out_path, fps = f"{output_dir}/{prompt.replace(' ','_')}.mp4", 4
    model.process_text2video(prompt, fps = fps, path = out_path, **params)
