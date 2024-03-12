import torch
from diffusers import AutoencoderKL, ControlNetModel, MotionAdapter
from diffusers.pipelines import DiffusionPipeline
from diffusers.schedulers import DPMSolverMultistepScheduler
import io
from PIL import Image
import numpy as np
import imageio
import math
from mayavi import mlab
from pyvirtualdisplay import Display
from tqdm import tqdm
from util import hex_to_tuple


display = Display(visible=0, size=(1280, 1024))
display.start()
mlab.options.offscreen = True
figure = mlab.figure(size=(1024, 1024), bgcolor=(0, 0, 0))
mlab.clf()

results = np.load('./priorMDM/save/my_humanml_trans_enc_512/DoubleTake_samples_my_humanml_trans_enc_512_000200000_seed10_handshake_20_double_take_blend_10_skipSteps_100/results.npy', allow_pickle=True).item()
motion = results['motion'][0]

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
    ((22, 23), '#990066'),
    ((23, 12), '#990099'),
    ((24, 25), '#660099'),
    ((25, 12), '#330099')
]

# Fill to (26, 3, 500) for openpose
motion = np.concatenate((motion, np.zeros((4, 3, 500))), axis=0)

figure.scene.disable_render = True

balls = []
lines = []
i = 0
for joint in joints:
    p = mlab.points3d(motion[joint[0]][2][i], motion[joint[0]][0][i], motion[joint[0]][1][i], color=hex_to_tuple(joint[1]), scale_factor=0.05)
    p.actor.property.lighting = False
    balls.append(p)
for con in connections:
    c = mlab.plot3d([motion[con[0][0]][2][i], motion[con[0][1]][2][i]], [motion[con[0][0]][0][i], motion[con[0][1]][0][i]], [motion[con[0][0]][1][i], motion[con[0][1]][1][i]], color=hex_to_tuple(con[1]), tube_radius=0.01)
    c.actor.property.lighting = False
    lines.append(c)

mlab.view(distance=5)

print(mlab.view())


images = []
for i in tqdm(range(80, 81, 2)):
    figure.scene.disable_render = True
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

    # for joint in joints:
    #     ax.scatter(motion[joint[0]][0][i], motion[joint[0]][1][i], motion[joint[0]][2][i], color=joint[1])
    # for con in connections:
    #     ax.plot([motion[con[0][0]][0][i], motion[con[0][1]][0][i]], [motion[con[0][0]][1][i], motion[con[0][1]][1][i]], [motion[con[0][0]][2][i], motion[con[0][1]][2][i]], color=con[1], linewidth=3)

    for j, joint in enumerate(joints):
        balls[j].mlab_source.set(x=motion[joint[0]][2][i], y=motion[joint[0]][0][i], z=motion[joint[0]][1][i])
    for j, con in enumerate(connections):
        lines[j].mlab_source.set(x=[motion[con[0][0]][2][i], motion[con[0][1]][2][i]], y=[motion[con[0][0]][0][i], motion[con[0][1]][0][i]], z=[motion[con[0][0]][1][i], motion[con[0][1]][1][i]])

    figure.scene.disable_render = False
    img = mlab.screenshot()
    images.append(Image.fromarray(img))

    img = Image.fromarray(img)
    img =img.resize((512, 512))
    img.save(f"frame_{i}.png")

    # cam,foc = mlab.move()
    # mlab.move(-0.1, 0, 0)

conditioning_frames = [img.resize((512, 512)) for img in images]

# Save the conditioning frames
imageio.mimsave(f"conditioning.mp4", conditioning_frames, fps=8, codec='libx264')

exit()

motion_id = "guoyww/animatediff-motion-adapter-v1-5-2"
adapter = MotionAdapter.from_pretrained(motion_id)
controlnet = ControlNetModel.from_pretrained("lllyasviel/control_v11p_sd15_openpose", torch_dtype=torch.float16)
vae = AutoencoderKL.from_pretrained("stabilityai/sd-vae-ft-mse", torch_dtype=torch.float16)
vae.enable_slicing()

model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
pipe = DiffusionPipeline.from_pretrained(
    model_id,
    motion_adapter=adapter,
    controlnet=controlnet,
    vae=vae,
    custom_pipeline="./pipeline_animatediff_controlnet.py",
).to(device="cuda", dtype=torch.float16)
pipe.scheduler = DPMSolverMultistepScheduler.from_pretrained(
    model_id, subfolder="scheduler", clip_sample=False, timestep_spacing="linspace", steps_offset=1, beta_schedule="linear", final_sigmas_type="sigma_min"
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

prompt = "humanoid robot walking on a beach, sunset in the background"
negative_prompt = "bad quality, worst quality, jpeg artifacts, ugly"

torch.manual_seed(1234)
with torch.no_grad():
    generator = torch.Generator(device="cuda")
    generator.manual_seed(1234)
    steps = 20
    n = 32
    overlap = 4
    window_size = 16
    latents = torch.randn([1, 4, n, 64, 64], device="cuda", dtype=torch.float16, generator=generator)
    ranges = [range(0, 16), range(8, 24), range(16, 32), [24,25,26,27,28,29,30,31,0,1,2,3,4,5,6,7], range(0, 32, 2), range(1, 32, 2)] # range(0, 32, 2), range(1, 32, 2)
    for step in range(0, steps):
        sum_latents = torch.zeros([1, 4, n, 64, 64], device="cuda", dtype=torch.float16)
        num_processed = torch.zeros([n], device="cuda", dtype=torch.float16)
        for r in ranges:
            result = pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                width=512,
                height=512,
                do_inference_steps=1,
                steps_offset=step,
                conditioning_frames=[conditioning_frames[i] for i in r],
                num_inference_steps=steps,
                num_frames=len(r),
                generator=generator,
                latents=latents[:, :, r, :, :],
                output_type="latent"
            )
            weight = 1
            sum_latents[:, :, r, :, :] += result.frames * weight
            num_processed[r] += weight
        latents = sum_latents / num_processed.view(1, 1, n, 1, 1)
    frames = pipe.decode_latents(latents)
    video = pipe.tensor2vid(frames, "pil")[0]
    imageio.mimsave(f"result.mp4", video, fps=8, codec='libx264')
