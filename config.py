"""
Configuration

Author: Josef Kuchař
"""

# Default params
config = {
    "guidance_scale": 1.0,  # CFG - 1.0 is recommended for AnimateDiff lightning
    "model": "SG161222/Realistic_Vision_V5.1_noVAE",  # Model ID for the base diffusion model
    "motion_adapter": "ByteDance/AnimateDiff-Lightning",  # Model ID for the motion adapter
    "motion_adapter_variant": "animatediff_lightning_8step_diffusers.safetensors",  # Model variant of the motion adapter
    "steps": 8,  # Number of steps for the diffusion model
    "model_ip_adapter": "nitrosocke/classic-anim-diffusion",  # Model ID for the IP adapter image generator
    "ip_adapter_scale": 0.7,  # Scale for the IP adapter
    "mdm_fps": 20,  # Motion diffusion model FPS
    "video_fps": 10,  # Video FPS
    "diffusion_resolution": (912, 512),  # Resolution of the diffusion model
    "final_resolution": (1920, 1088),  # Final resolution of the video
    "max_scene_length": 60,  # Maximum length of a scene in the scenario (seconds)
    "demo_max_length": 120,  # Maximum length of the video in demo mode (seconds)
}
