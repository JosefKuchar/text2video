import diffusers
import warnings
import coloredlogs
import logging
from args import parse_args
from text2video import generate_video
import json
import jsonschema
from scenario import generate_scenario, validate_scenario, ScenarioValidationError
import os


def text2scenario(args):
    try:
        # Generate scenario
        scenario = generate_scenario(args.prompt)

        # Validate scenario
        validate_scenario(scenario)
    except ScenarioValidationError as e:
        logger.error("Generated scenario is invalid, try again")
        exit(1)

    # Save scenario to file
    with open(args.path, "w") as f:
        json.dump(scenario, f, indent=4)


def scenario2video(args):
    # Load scenario
    scenario = json.load(args.scenario)

    # Validate scenario
    try:
        validate_scenario(scenario)
    except ScenarioValidationError as e:
        logger.error("Invalid scenario")
        logger.error(e)
        exit(1)

    # Setup paths
    os.makedirs(args.path, exist_ok=True)
    final_path = os.path.join(args.path, "video.mp4")
    conditioning_path = os.path.join(args.path, "conditioning.mp4")

    # Generate video
    ip_images = generate_video(args, scenario, final_path, conditioning_path)

    # Save ip images
    if args.save_ip_images:
        for i, ip_image in enumerate(ip_images):
            ip_image.save(os.path.join(args.path, f"ip_image_{i}.png"))


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
        scenario2video(args)
    else:
        text2scenario(args)
