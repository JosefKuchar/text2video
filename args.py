import argparse
from config import config


def parse_args():
    """
    Parse command line arguments.
    """

    parser = argparse.ArgumentParser(
        prog="text2video", description="Generate video driven by human motion from text"
    )
    prompt_group = parser.add_mutually_exclusive_group(required=True)
    prompt_group.add_argument("--prompt", help="Prompt for the video generation")
    prompt_group.add_argument(
        "--scenario",
        help="Scenario for the video generation",
        type=argparse.FileType("r"),
    )
    parser.add_argument(
        "--model",
        default=config["model"],
        help="Model ID for the base diffusion model",
    )
    parser.add_argument(
        "--motion-adapter",
        default=config["motion_adapter"],
        help="Model ID for the motion adapter",
    )
    parser.add_argument(
        "--motion-adapter-variant",
        default=config["motion_adapter_variant"],
        help="Model variant for the motion adapter",
    )
    parser.add_argument(
        "--steps",
        type=int,
        default=config["steps"],
        help="Number of steps for the diffusion model",
    )
    parser.add_argument(
        "--guidance-scale", type=float, default=config["guidance_scale"]
    )
    parser.add_argument(
        "-s", "--seed", type=int, help="seed for random number generators"
    )
    parser.add_argument(
        "--model-ip-adapter",
        default=config["model_ip_adapter"],
        help="Model ID for the IP adapter image generator",
    )
    parser.add_argument(
        "--ip-adapter-scale",
        type=float,
        default=config["ip_adapter_scale"],
        help="Scale for the IP adapter",
    )
    parser.add_argument(
        "--path", help="Path to save the generated video and other files", required=True
    )

    return parser.parse_args()
