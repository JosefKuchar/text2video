"""
Upscale video frames using Real ESRGAN (https://github.com/xinntao/Real-ESRGAN)

Parameters taken from https://github.com/xinntao/Real-ESRGAN/blob/master/inference_realesrgan.py
"""

# Import fix adapted from https://github.com/AUTOMATIC1111/stable-diffusion-webui/pull/14186
import sys
import torchvision.transforms.functional as functional

sys.modules["torchvision.transforms.functional_tensor"] = functional
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
from tqdm import tqdm
from util import cv2_to_pil, pil_to_cv2

model = RRDBNet(
    num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4
)
netscale = 4
model_path = "models/RealESRGAN_x4plus.pth"

upsampler = RealESRGANer(
    scale=netscale,
    model_path=model_path,
    dni_weight=None,
    model=model,
    tile=0,
    tile_pad=10,
    pre_pad=0,
    half=True,
)


def upscale(frames):
    """
    Upscale video frame using Real ESRGAN

    :param frames: list of frames
    """

    upscaled_frames = []
    for frame in tqdm(frames):
        frame = pil_to_cv2(frame)
        output, _ = upsampler.enhance(frame, outscale=4)
        output = cv2_to_pil(output)
        upscaled_frames.append(output)
    return upscaled_frames
