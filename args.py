import argparse


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
        default="SG161222/Realistic_Vision_V5.1_noVAE",
        help="Model ID for the base diffusion model",
    )
    parser.add_argument(
        "--motion-adapter",
        default="ByteDance/AnimateDiff-Lightning",
        help="Model ID for the motion adapter",
    )
    parser.add_argument(
        "--motion-adapter-variant",
        default="animatediff_lightning_4step_diffusers.safetensors",
        help="Model variant for the motion adapter",
    )
    parser.add_argument(
        "--steps",
        type=int,
        default=4,
        help="Number of steps for the diffusion model",
    )
    parser.add_argument("--guidance-scale", type=float, default=1.0)
    parser.add_argument(
        "-s", "--seed", type=int, help="seed for random number generators"
    )
    parser.add_argument(
        "--skip-motion",
        action="store_true",
        help="skip motion inference, use cached results",
    )
    parser.add_argument(
        "--skip-motion-rendering",
        action="store_true",
        help="skip rendering of the motion conditioning frames",
    )
    parser.add_argument(
        "--skip-upscaling", action="store_true", help="skip upscaling of the video"
    )
    parser.add_argument(
        "--cache", action="store_true", help="Cache the results of the motion inference"
    )

    return parser.parse_args()
