import gradio as gr
import tempfile
from diffusion import create_pipeline, generate_video
from priorMDM.infer import main
import logging
from conditioning import generate_conditioning_frames
from scenario import generate_scenario, validate_scenario
from gradio_scenario import Scenario
import imageio
import json
import diffusers
import coloredlogs
import warnings
from util import dotdict

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


def upload_scenario(file):
    with open(file, "r") as f:
        scenario = json.load(f)
    return scenario


def text2scenario(input):
    scenario = generate_scenario(input)
    return scenario


def scenario2video(scenario):
    print("scenario", scenario)
    args = dotdict(
        {
            "model": "SG161222/Realistic_Vision_V5.1_noVAE",
            "motion_adapter": "ByteDance/AnimateDiff-Lightning",
            "motion_adapter_variant": "animatediff_lightning_4step_diffusers.safetensors",
            "steps": 4,
            "guidance_scale": 1.0,
        }
    )
    pipeline = create_pipeline(args)

    # TODO: Scenario validation

    video = []
    video_conditioning = []
    for i, scene in enumerate(scenario):
        logger.info(f"Generating scene #{i + 1}")
        prompts = [
            (action["motion_description"], action["length"] * 20)
            for action in scene["actions"]
        ]
        print(prompts)

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

    _, result_file = tempfile.mkstemp(suffix=".mp4")
    _, conditioning_file = tempfile.mkstemp(suffix=".mp4")

    # Save the video
    logger.info("Saving the video")
    imageio.mimsave(result_file, video, fps=10, codec="libx264")
    imageio.mimsave(conditioning_file, video_conditioning, fps=10, codec="libx264")
    logger.info("Successfully generated video")

    return conditioning_file, result_file


# Build the UI
with gr.Blocks() as interface:
    with gr.Row():
        with gr.Column(scale=1):
            input_text = gr.TextArea(label="Vstupní text")
            btn_text = gr.Button("Generovat scénář")
            scenario = Scenario()
            btn_scenario = gr.Button("Generovat video")
            scenario_upload = gr.File(
                label="Nahrát scénář", file_types=[".json"], type="filepath"
            )
        with gr.Column(scale=1):
            controlnet_video = gr.PlayableVideo(
                label="Řídící snímky", interactive=False
            )
            final_video = gr.PlayableVideo(label="Výstupní video", interactive=False)

    # Define actions
    btn_text.click(fn=text2scenario, inputs=input_text, outputs=scenario)
    btn_scenario.click(
        fn=scenario2video, inputs=scenario, outputs=[controlnet_video, final_video]
    )
    scenario_upload.upload(fn=upload_scenario, inputs=scenario_upload, outputs=scenario)

# Launch web UI
interface.launch(share=True)
