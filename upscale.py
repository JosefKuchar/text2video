"""
Upscale video frames using Real ESRGAN (https://github.com/xinntao/Real-ESRGAN)

Parameters taken from https://github.com/xinntao/Real-ESRGAN/blob/master/inference_realesrgan.py
"""

# Import fix adapted from https://github.com/AUTOMATIC1111/stable-diffusion-webui/pull/14186
import sys
import torchvision.transforms.functional as functional

sys.modules["torchvision.transforms.functional_tensor"] = functional
from basicsr.archs.srvgg_arch import SRVGGNetCompact
from realesrgan import RealESRGANer
from tqdm import tqdm
from util import cv2_to_pil, pil_to_cv2
import logging
import config
import cv2

model = SRVGGNetCompact(
    num_in_ch=3, num_out_ch=3, num_feat=64, num_conv=16, upscale=4, act_type="prelu"
)
netscale = 4
model_path = "models/realesr-animevideov3.pth"

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

logger = logging.getLogger(__name__)


def upscale(frames):
    """
    Upscale video frame using Real ESRGAN

    :param frames: list of frames
    """

    logger.info("Upscaling video frames using Real ESRGAN")
    upscaled_frames = []
    for frame in tqdm(frames):
        frame = pil_to_cv2(frame)
        output, _ = upsampler.enhance(frame, outscale=4)
        output = cv2.resize(output, config["final_resolution"])
        output = cv2_to_pil(output)
        upscaled_frames.append(output)
    return upscaled_frames
