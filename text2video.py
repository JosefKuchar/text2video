import torch
import imageio
from conditioning import generate_conditioning_frames
import diffusers
import warnings
from priorMDM.infer import main
import coloredlogs
import logging
from args import parse_args
from diffusion import generate_video
import json
from scenario import generate_scenario

if __name__ == "__main__":
    # Disable some warnings
    warnings.filterwarnings("ignore", category=FutureWarning)
    # warnings.filterwarnings("ignore", category=UserWarning)

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

    if not args.skip_motion:
        prompts = [
            (scene["motion_description"], scene["length"] * 20)
            for scene in scenario["scenes"]
        ]
        print(prompts)

        results = main(prompts)
        motion = results["motion"][0]
        lengths = results["lengths"]

        # Save the motion data
        if args.cache:
            torch.save(motion, "cache/motion.pt")
            torch.save(lengths, "cache/lengths.pt")
    else:
        motion = torch.load("cache/motion.pt")
        lengths = torch.load("cache/lengths.pt")

    if not args.skip_motion_rendering:
        conditioning_frames = generate_conditioning_frames(
            motion=motion, start=0, stop=motion.shape[2], step=2
        )
        if args.cache:
            torch.save(conditioning_frames, "cache/conditioning_frames.pt")
    else:
        conditioning_frames = torch.load("cache/conditioning_frames.pt")

    # Save the conditioning frames
    imageio.mimsave("conditioning.mp4", conditioning_frames[1], fps=10, codec="libx264")

    # Generate the video
    generate_video(args, conditioning_frames, scenario, lengths)
