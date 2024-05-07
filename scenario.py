"""
TODO: Description
"""

from llama_cpp import Llama
import logging
from yaspin import yaspin
from config import config
import jsonschema
import json

logger = logging.getLogger(__name__)

# JSON schema for scenario
schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "character_description": {"type": "string"},
            "actions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "length": {"type": "number"},
                        "motion_description": {"type": "string"},
                        "scene_description": {"type": "string"},
                    },
                    "required": [
                        "length",
                        "scene_description",
                    ],
                },
            },
        },
        "required": [
            "actions",
        ],
    },
}


class ScenarioValidationError(Exception):
    """
    Raised when scenario validation fails
    """

    pass


def validate_schema(scenario: dict):
    """
    Validate scenario against schema
    Raises ScenarioValidationError if validation fails

    :param scenario: Scenario to validate
    """

    # Validate scenario against schema
    try:
        jsonschema.validate(scenario, schema)
    except jsonschema.ValidationError as e:
        raise ScenarioValidationError(str(e))


def validate_scenario(scenario: dict, demo=False):
    """
    Validate scenario against schema and custom rules
    Raises ScenarioValidationError if validation fails

    :param scenario: Scenario to validate
    """

    # Validate schema
    validate_schema(scenario)

    # Custom rules
    if len(scenario) == 0:
        raise ScenarioValidationError("Scenario must have at least one scene")

    # Check each scene
    total_length = 0
    for i, scene in enumerate(scenario):
        scene_length = 0
        is_character_scene = scene["character_description"].strip() != ""
        if len(scene["actions"]) == 0:
            raise ScenarioValidationError(
                f"Scene #{i + 1} must have at least one action"
            )
        # Check each action
        for j, action in enumerate(scene["actions"]):
            total_length += action["length"]
            scene_length += action["length"]
            if action["length"] <= 0:
                raise ScenarioValidationError(
                    f"Action #{j + 1} in scene #{i + 1} must have a positive length"
                )
            if len(action["scene_description"]) == 0:
                raise ScenarioValidationError(
                    f"Action #{j + 1} in scene #{i + 1} must have a scene description"
                )
            if is_character_scene and len(action["motion_description"]) == 0:
                raise ScenarioValidationError(
                    f"Action #{j + 1} in scene #{i + 1} must have a motion description"
                )

        # Check total length of scene
        if scene_length > config["max_scene_length"]:
            raise ScenarioValidationError(
                f"Total length of scene #{i + 1} must be less than {config['max_scene_length']} seconds"
            )
    # If in demo mode, check total length
    if demo and total_length > config["demo_max_length"]:
        raise ScenarioValidationError(
            f"Total length of the scenario must be less than {config['demo_max_length']} seconds"
        )


def generate_scenario(prompt: str):
    """
    Generate scnenario in JSON format based on prompt

    :param prompt: Prompt for the story generation
    """

    logger.info("Loading large language model")

    llm = Llama.from_pretrained(
        repo_id="QuantFactory/Meta-Llama-3-8B-GGUF",
        filename="Meta-Llama-3-8B.Q6_K.gguf",
        # n_gpu_layers=-1,
        n_ctx=4096,
        n_batch=4096,
        verbose=False,
    )

    logger.info("Generating scenario based on prompt")

    # Generate scenario based on prompt
    with yaspin(text="Generating scenario based on prompt"):
        res = llm.create_chat_completion(
            messages=[
                {
                    "role": "user",
                    "content": """You are a helpful assistant that outputs in JSON.

Here are details about the JSON object you need to create:

Root object is an array of scenes
'character_description' is a description of the character in all actions
'actions' is a list of actions the character performs
'length' is the duration of the action in seconds
'motion_description' is a description of the motion in the action
'scene_description' is a visual description of the action

Keep all descriptions very short, eg. motion description can be just "walking"!

Create story about a person in a park, approximately 1 minute long. It is sunny and the person is wearing a red shirt.""",
                },
                {
                    "role": "assistant",
                    "content": """[{"character_description":"A person with short black hair, wearing a bright red shirt and jeans, is in a sunny park.","actions":[{"length":10,"motion_description":"walking","scene_description":"Tall green trees line the path, flowers bloom colorfully on either side."},{"length":6,"motion_description":"sitting","scene_description":"An old wooden bench under a large oak tree, leaves casting dappled shadows on the ground."},{"length":8,"motion_description":"feeding ducks","scene_description":"The pond's edge is dotted with reeds and water lilies, ducks gather eagerly."},{"length":6,"motion_description":"watching","scene_description":"A wide grassy area where children chase a brightly colored frisbee under the sun."}]}]""",
                },
                {"role": "user", "content": prompt},
            ],
            response_format={
                "type": "json_object",
                "schema": schema,
            },
            temperature=0.7,
        )

    # Parse JSON
    try:
        res = json.loads(res["choices"][0]["message"]["content"])
    except json.JSONDecodeError as e:
        raise ScenarioValidationError(str(e))

    # Clamp length of each action to 10 seconds
    for scene in res:
        for action in scene["actions"]:
            action["length"] = min(action["length"], 10)

    return res
