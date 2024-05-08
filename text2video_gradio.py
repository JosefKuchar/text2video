"""
Gradio interface for text2video

Author: Josef Kuchař
"""

import gradio as gr
import tempfile
from text2video import generate_video
import logging
from scenario import generate_scenario, validate_scenario, validate_schema
from gradio_scenario import Scenario
import json
import diffusers
import coloredlogs
import warnings
import argparse
from util import dotdict
from config import config

callback = gr.CSVLogger()
demo = False


def upload_scenario(file: str) -> dict:
    """
    Upload scenario from file

    :param file: File
    :return: Scenario
    """

    try:
        with open(file, "r") as f:
            scenario = json.load(f)
        validate_schema(scenario)
        return scenario
    except Exception as e:
        logger.error(e)
        raise gr.Error(str(e))


def text2scenario(input: str) -> dict:
    """
    Generate scenario from input

    :param input: Input text
    :return: Scenario
    """
    try:
        scenario = generate_scenario(input)
        validate_schema(scenario)
        return scenario
    except Exception as e:
        logger.error(e)
        raise gr.Error(str(e))


def scenario2video(
    scenario: dict,
    cfg: float,
    steps: int,
    model: str,
    motion_adapter: str,
    motion_adapter_variant: str,
    model_ip_adapter: str,
    ip_adapter_scale: float,
) -> tuple[str, str]:
    """
    Generate video from scenario

    :param scenario: Scenario
    :param cfg: Guidance scale
    :param steps: Steps
    :param model: Model
    :param motion_adapter: Motion adapter
    :param motion_adapter_variant: Motion adapter variant
    :param model_ip_adapter: Model for IP adapter image generation
    :param ip_adapter_scale: IP adapter scale
    :return: Conditioning file, Result file
    """

    args = dotdict(
        {
            "model": model,
            "motion_adapter": motion_adapter,
            "motion_adapter_variant": motion_adapter_variant,
            "steps": steps,
            "guidance_scale": cfg,
            "model_ip_adapter": model_ip_adapter,
            "ip_adapter_scale": ip_adapter_scale,
        }
    )
    try:
        # Validate scenario
        validate_scenario(scenario, demo=demo)

        # Create temporary files
        _, result_file = tempfile.mkstemp(suffix=".mp4")
        _, conditioning_file = tempfile.mkstemp(suffix=".mp4")

        # Generate video
        ip_images = generate_video(args, scenario, result_file, conditioning_file)
        ip_images = [
            (ip_images, f"Scene character #{i + 1}")
            for i, ip_images in enumerate(ip_images)
        ]

        # Return file paths and IP images
        return conditioning_file, result_file, ip_images
    except Exception as e:
        logger.error(e)
        raise gr.Error(str(e))


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

    # Parse args
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--demo", action="store_true", help="Run in demo mode (restricted)"
    )
    args = parser.parse_args()
    if args.demo:
        demo = True

    # Build the UI
    with gr.Blocks() as interface:
        # Define components
        with gr.Row():
            with gr.Column(scale=1):
                input_text = gr.TextArea(label="Textual story")
                btn_text = gr.Button("Generate scenario")
                scenario = Scenario(label="Scenario")
                btn_scenario = gr.Button("Generate video")
                scenario_upload = gr.File(
                    label="Upload scenario", file_types=[".json"], type="filepath"
                )
                with gr.Accordion("Advanced settings", visible=not demo):
                    cfg = gr.Slider(
                        label="Guidance scale",
                        minimum=1.0,
                        maximum=3.0,
                        step=0.1,
                        value=config["guidance_scale"],
                    )
                    steps = gr.Slider(
                        label="Steps",
                        minimum=2,
                        maximum=10,
                        step=1,
                        value=config["steps"],
                    )
                    model = gr.Textbox(
                        label="Model (video generator)", value=config["model"]
                    )
                    motion_adapter = gr.Textbox(
                        label="Motion adapter", value=config["motion_adapter"]
                    )
                    motion_adapter_variant = gr.Textbox(
                        label="Motion adapter variant",
                        value=config["motion_adapter_variant"],
                    )
                    model_ip_adapter = gr.Textbox(
                        label="Model (character generator)",
                        value=config["model_ip_adapter"],
                    )
                    ip_adapter_scale = gr.Slider(
                        label="IP Adapter scale",
                        minimum=0.0,
                        maximum=1.0,
                        step=0.1,
                        value=config["ip_adapter_scale"],
                    )
            with gr.Column(scale=1):
                controlnet_video = gr.PlayableVideo(
                    label="Conditioning video", interactive=False
                )
                final_video = gr.PlayableVideo(
                    label="Final animation", interactive=False
                )
                ip_gallery = gr.Gallery(
                    label="Scene characters",
                    columns=[3],
                    rows=[1],
                    object_fit="contain",
                    height="auto",
                )
                btn = gr.Button("Flag")

        # Define actions
        btn_text.click(fn=text2scenario, inputs=input_text, outputs=scenario)
        btn_scenario.click(
            fn=scenario2video,
            inputs=[
                scenario,
                cfg,
                steps,
                model,
                motion_adapter,
                motion_adapter_variant,
                model_ip_adapter,
                ip_adapter_scale,
            ],
            outputs=[controlnet_video, final_video, ip_gallery],
        )
        scenario_upload.upload(
            fn=upload_scenario, inputs=scenario_upload, outputs=scenario
        )
        callback.setup(
            [
                input_text,
                scenario,
                cfg,
                steps,
                model,
                motion_adapter,
                motion_adapter_variant,
                model_ip_adapter,
                ip_adapter_scale,
                controlnet_video,
                final_video,
            ],
            "flagged",
        )
        btn.click(
            lambda *args: callback.flag(args),
            [
                input_text,
                scenario,
                cfg,
                steps,
                model,
                motion_adapter,
                motion_adapter_variant,
                model_ip_adapter,
                ip_adapter_scale,
                controlnet_video,
                final_video,
            ],
            None,
            preprocess=False,
        )

    # Launch web UI
    interface.launch(share=True, show_error=True)
