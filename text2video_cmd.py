import diffusers
import warnings
import coloredlogs
import logging
from args import parse_args
from text2video import generate_video
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

    generate_video(args, scenario, "result.mp4", "conditioning.mp4")
