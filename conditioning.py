"""

"""

from PIL import Image
import numpy as np
from mayavi import mlab
from pyvirtualdisplay import Display
from tqdm import tqdm
import util

# Create virtual display for rendering offscreen
display = Display(visible=0, size=(1280, 1024))
display.start()

# Enable offscreen rendering
mlab.options.offscreen = True

# Create mayavi figure
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

# Expand motion array for head and eye joints
motion = np.concatenate((motion, np.zeros((4, 3, 500))), axis=0)

# Disable rendering for faster loading
figure.scene.disable_render = True

# Create level geometry
balls = []
lines = []
i = 0
for joint in joints:
    p = mlab.points3d(motion[joint[0]][2][i], motion[joint[0]][0][i], motion[joint[0]][1][i], color=util.hex_to_tuple(joint[1]), scale_factor=0.05)
    p.actor.property.lighting = False
    balls.append(p)
for con in connections:
    c = mlab.plot3d([motion[con[0][0]][2][i], motion[con[0][1]][2][i]], [motion[con[0][0]][0][i], motion[con[0][1]][0][i]], [motion[con[0][0]][1][i], motion[con[0][1]][1][i]], color=util.hex_to_tuple(con[1]), tube_radius=0.01)
    c.actor.property.lighting = False
    lines.append(c)

# Set camera position
mlab.view(distance=5)

# Frame by frame rendering
images = []
for i in tqdm(range(150, 214, 2)):
    # Disable rendering when manipulating geometry position
    figure.scene.disable_render = True

    # Calculate neck joint (center of shoulders)
    for j in range(3):
        motion[9][j][i] = (motion[13][j][i] + motion[14][j][i]) / 2

    # Calculate normal vector from points 9, 12, 15 (neck, head, and nose joints)
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

    # Calculate eye and head joint positions
    for j in range(3):
        motion[22][j][i] = motion[12][j][i] + cp[j]
        motion[23][j][i] = motion[12][j][i] + cp[j] * 0.5 + eye_vec[j]
        motion[24][j][i] = motion[12][j][i] + -cp[j]
        motion[25][j][i] = motion[12][j][i] + -cp[j] * 0.5 + eye_vec[j]

    # Update geometry
    for j, joint in enumerate(joints):
        balls[j].mlab_source.set(x=motion[joint[0]][2][i], y=motion[joint[0]][0][i], z=motion[joint[0]][1][i])
    for j, con in enumerate(connections):
        lines[j].mlab_source.set(x=[motion[con[0][0]][2][i], motion[con[0][1]][2][i]], y=[motion[con[0][0]][0][i], motion[con[0][1]][0][i]], z=[motion[con[0][0]][1][i], motion[con[0][1]][1][i]])

    # Re-enable rendering
    figure.scene.disable_render = False

    # Capture frame
    img = mlab.screenshot()

    # Append rendered frame to list
    images.append(Image.fromarray(img))

# Stop virtual display
display.sendstop()

# Resize frames to 512x512
conditioning_frames = [img.resize((512, 512)) for img in images]
