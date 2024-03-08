import torch
from diffusers import AutoencoderKL, ControlNetModel, MotionAdapter
from diffusers.pipelines import DiffusionPipeline
from diffusers.schedulers import DPMSolverMultistepScheduler
import io
from PIL import Image
import numpy as np
import imageio
import matplotlib.pyplot as plt
import math

results = np.load('./priorMDM/save/my_humanml_trans_enc_512/DoubleTake_samples_my_humanml_trans_enc_512_000200000_seed10_handshake_20_double_take_blend_10_skipSteps_100/results.npy', allow_pickle=True).item()
motion = results['motion'][0]
fig = plt.figure(figsize=(5,5))

ax = fig.add_subplot(111, projection='3d')

# https://stackoverflow.com/questions/25575729/how-to-zoom-with-axes3d-in-matplotlib

RADIUS = 1.0  # Control this value.
# ax.set_xlim3d(-RADIUS / 2, RADIUS / 2)
# ax.set_zlim3d(-RADIUS / 2, RADIUS / 2)
# ax.set_ylim3d(-RADIUS / 2, RADIUS / 2)

# https://observablehq.com/@hellonearthis/bwalker-to-open-pose

joints = [
    (1,'#0055FF'),
    (2,'#00FFAA'),
    (4,'#0000FF'),
    (5,'#00FFFF'),
    (7,'#5500FF'),
    (8,'#00AAFF'),
    (9,'#FF5500'),
    (12,'#FF0000'),
    # (15,'#000000'),
    (16,'#55FF00'),
    (17,'#FFAA00'),
    (18,'#00FF00'),
    (19,'#FFFF00'),
    (20,'#00FF55'),
    (21,'#AAFF00'),
    (22, '#FF0055'),
    (23, '#FF00FF'),
    (24, '#FF00AA'),
    (25, '#AA00FF')
]

connections = [
    ((9,1),'#009999'),
    ((1,4),'#006699'),
    ((4,7),'#003399'),
    ((9, 2),'#009900'),
    ((2,5),'#009933'),
    ((5,8),'#009966'),
    ((17,19),'#996600'),
    ((19, 21),'#999900'),
    ((16, 18),'#669900'),
    ((18, 20),'#339900'),
    ((16, 9),'#993300'),
    ((17, 9),'#990000'),
    ((9, 12),'#000099'),
    ((22, 23), '#990066'), # 660099
    ((23, 12), '#990099'), # 330099
    ((24, 25), '#660099'), # 990066
    ((25, 12), '#330099')  # 990099
]

# Fill to (26, 3, 500) for openpose
motion = np.concatenate((motion, np.zeros((4, 3, 500))), axis=0)

images = []
for i in range(0, 400, 2):
    ax.set_box_aspect((1,1,1))
    ax.view_init(70, 0, 90)
    ax.set_axis_off()
    ax.set_facecolor((0,0,0))

    zoom = 0.9
    ax.axes.set_xlim3d(left=-zoom, right=zoom)
    ax.axes.set_ylim3d(bottom=0, top=zoom*2)
    ax.axes.set_zlim3d(bottom=-zoom, top=zoom)

    # Calculate neck joint (center of shoulders)
    for j in range(3):
        motion[9][j][i] = (motion[13][j][i] + motion[14][j][i]) / 2

    # Calculate normal vector from points 9, 12, 15
    p1 = np.array([motion[9][0][i], motion[9][1][i], motion[9][2][i]])
    p2 = np.array([motion[12][0][i], motion[12][1][i], motion[12][2][i]])
    p3 = np.array([motion[15][0][i], motion[15][1][i], motion[15][2][i]])
    v1 = p2 - p1
    v2 = p3 - p1
    cp = np.cross(v1, v2)
    cp = (cp / np.linalg.norm(cp)) / 12

    # Calculate eye vector
    eye_vec = (v1 / np.linalg.norm(v1)) / 20

    # Make head bigger (multiply by 2)
    for j in range(3):
        motion[12][j][i] = motion[9][j][i] + (motion[12][j][i] - motion[9][j][i]) * 2

    for j in range(3):
        motion[22][j][i] = motion[12][j][i] + cp[j]
        motion[23][j][i] = motion[12][j][i] + cp[j] * 0.5 + eye_vec[j]
        motion[24][j][i] = motion[12][j][i] + -cp[j]
        motion[25][j][i] = motion[12][j][i] + -cp[j] * 0.5 + eye_vec[j]

    for joint in joints:
        ax.scatter(motion[joint[0]][0][i], motion[joint[0]][1][i], motion[joint[0]][2][i], color=joint[1])
    for con in connections:
        ax.plot([motion[con[0][0]][0][i], motion[con[0][1]][0][i]], [motion[con[0][0]][1][i], motion[con[0][1]][1][i]], [motion[con[0][0]][2][i], motion[con[0][1]][2][i]], color=con[1], linewidth=3)

    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
    buf = io.BytesIO()
    fig.savefig(buf, dpi=300)
    im = Image.open(buf)
    images.append(im)
    # buf.close()
    ax.clear()

conditioning_frames = [img.resize((512, 512)) for img in images]

# Save the conditioning frames
imageio.mimsave(f"result.mp4", conditioning_frames, fps=8, codec='libx264')

# motion_id = "guoyww/animatediff-motion-adapter-v1-5-2"
# adapter = MotionAdapter.from_pretrained(motion_id)
# controlnet = ControlNetModel.from_pretrained("lllyasviel/control_v11p_sd15_openpose", torch_dtype=torch.float16)
# vae = AutoencoderKL.from_pretrained("stabilityai/sd-vae-ft-mse", torch_dtype=torch.float16)
# vae.enable_slicing()

# model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
# pipe = DiffusionPipeline.from_pretrained(
#     model_id,
#     motion_adapter=adapter,
#     controlnet=controlnet,
#     vae=vae,
#     custom_pipeline="./pipeline_animatediff_controlnet.py",
# ).to(device="cuda", dtype=torch.float16)
# pipe.scheduler = DPMSolverMultistepScheduler.from_pretrained(
#     model_id, subfolder="scheduler", clip_sample=False, timestep_spacing="linspace", steps_offset=1, beta_schedule="linear", final_sigmas_type="sigma_min"
# )
# # pipe.load_lora_weights(
# #     "guoyww/animatediff-motion-lora-zoom-out", adapter_name="zoom-out",
# # )
# # pipe.load_lora_weights(
# #     "guoyww/animatediff-motion-lora-pan-left", adapter_name="pan-left",
# # )
# # pipe.set_adapters(["zoom-out", "pan-left"], adapter_weights=[1.0, 1.0])
# pipe.enable_vae_slicing()

# prompt = "man walking in the street"
# negative_prompt = "bad quality, worst quality, jpeg artifacts, ugly"

# torch.manual_seed(1234)
# with torch.no_grad():
#     generator = torch.Generator(device="cuda")
#     generator.manual_seed(1234)
#     steps = 20
#     n = 32
#     overlap = 4
#     window_size = 16
#     latents = torch.randn([1, 4, n, 64, 64], device="cuda", dtype=torch.float16, generator=generator)
#     ranges = [range(0, 16), range(8, 24), range(16, 32), [24,25,26,27,28,29,30,31,0,1,2,3,4,5,6,7], range(0, 32, 2), range(1, 32, 2)] # range(0, 32, 2), range(1, 32, 2)
#     for step in range(0, steps):
#         sum_latents = torch.zeros([1, 4, n, 64, 64], device="cuda", dtype=torch.float16)
#         num_processed = torch.zeros([n], device="cuda", dtype=torch.float16)
#         for r in ranges:
#             result = pipe(
#                 prompt=prompt,
#                 negative_prompt=negative_prompt,
#                 width=512,
#                 height=512,
#                 do_inference_steps=1,
#                 steps_offset=step,
#                 conditioning_frames=[conditioning_frames[i] for i in r],
#                 num_inference_steps=steps,
#                 num_frames=len(r),
#                 generator=generator,
#                 latents=latents[:, :, r, :, :],
#                 output_type="latent"
#             )
#             weight = 1
#             sum_latents[:, :, r, :, :] += result.frames * weight
#             num_processed[r] += weight
#         latents = sum_latents / num_processed.view(1, 1, n, 1, 1)
#     frames = pipe.decode_latents(latents)
#     video = pipe.tensor2vid(frames, "pil")[0]
#     imageio.mimsave(f"result.mp4", video, fps=8, codec='libx264')
