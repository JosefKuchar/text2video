import torch
import imageio
from conditioning import generate_conditioning_frames
import diffusers
import warnings
from priorMDM.infer import main
import coloredlogs
import logging
from args import parse_args
from diffusion import generate_video, create_pipeline
import json
import jsonschema
from scenario import generate_scenario, validate_scenario

if __name__ == "__main__":
    # Disable some warnings
    warnings.filterwarnings("ignore", category=FutureWarning)
    warnings.filterwarnings("ignore", category=UserWarning)

    # Set up logging
    coloredlogs.DEFAULT_LOG_FORMAT = (
        "%(asctime)s %(hostname)s %(name)s %(levelname)s %(message)s"
    )
    coloredlogs.install(level="INFO")
    diffusers.logging.set_verbosity_error()
    logger = logging.getLogger(__name__)

    # Parse arguments
    args = parse_args()

    if args.scenario:
        scenario = json.load(args.scenario)
    else:
        scenario = generate_scenario(args.prompt)

    try:
        validate_scenario(scenario)
    except jsonschema.exceptions.ValidationError as e:
        logger.error("Invalid scenario")
        logger.error(e)
        exit(1)

    pipeline = create_pipeline(args)

    video = []
    video_conditioning = []
    for i, scene in enumerate(scenario):
        logger.info(f"Generating scene #{i + 1}")
        prompts = [
            (action["motion_description"], action["length"] * 20)
            for action in scene["actions"]
        ]

        results = main(prompts)
        motion = results["motion"][0]
        lengths = results["lengths"]

        # Generate conditioning frames
        conditioning_frames = generate_conditioning_frames(
            motion=motion, start=0, stop=motion.shape[2], step=2
        )

        # Generate the video
        frames = generate_video(pipeline, args, conditioning_frames, scene, lengths)

        # Flat append to frames
        video.extend(frames)
        video_conditioning.extend(conditioning_frames[1])

    # Save the video
    logger.info("Saving the video")
    imageio.mimsave("result.mp4", video, fps=10, codec="libx264")
    imageio.mimsave("conditioning.mp4", video_conditioning, fps=10, codec="libx264")
    logger.info("Successfully generated video")
