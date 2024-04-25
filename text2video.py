import logging
from priorMDM.infer import main
from diffusion import create_pipeline, generate_scene
from conditioning import generate_conditioning_frames
import config
import imageio
from util import dotdict

logger = logging.getLogger(__name__)


def generate_video(
    args: dotdict, scenario: dict, result_path: str, conditioning_path: str
):
    pipeline = create_pipeline(args)
    video = []
    video_conditioning = []
    ip_images = []
    for i, scene in enumerate(scenario):
        logger.info(f"Generating scene #{i + 1}")
        prompts = [
            (action["motion_description"], action["length"] * config["mdm_fps"])
            for action in scene["actions"]
        ]

        results = main(prompts)
        motion = results["motion"][0]
        lengths = results["lengths"]

        # Generate conditioning frames
        conditioning_frames = generate_conditioning_frames(
            motion=motion, start=0, stop=motion.shape[2], step=(config["mdm_fps"] // config["video_fps"])
        )

        # Generate the scene
        frames, ip_image = generate_scene(
            pipeline, args, conditioning_frames, scene, lengths
        )

        # Flat append to frames
        video.extend(frames)
        video_conditioning.extend(conditioning_frames[1])
        ip_images.append(ip_image)

    # Save the video
    logger.info("Saving the video")
    imageio.mimsave(result_path, video, fps=config["video_fps"], codec="libx264")
    imageio.mimsave(
        conditioning_path, video_conditioning, fps=config["video_fps"], codec="libx264"
    )
    logger.info("Successfully generated video")

    # Return ip_images
    return ip_images
