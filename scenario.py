"""

"""

from llama_cpp import Llama
import logging
from yaspin import yaspin
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
    },
}


def validate_scenario(scenario: dict):
    """
    Validate scenario against schema

    :param scenario: Scenario to validate
    """

    # Validate scenario against schema
    jsonschema.validate(scenario, schema)


def generate_scenario(prompt: str):
    """
    Generate scnenario in JSON format based on prompt

    :param prompt: Prompt for the story generation
    """

    logger.info("Loading large language model")

    llm = Llama.from_pretrained(
        repo_id="TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
        filename="mistral-7b-instruct-v0.2.Q4_K_M.gguf",
        n_gpu_layers=-1,
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
Keep all descriptions very short, eg. motion description can be just "walking"

Create story about a person in a park, approximately 1 minute long. It is sunny and the person is wearing a red shirt.""",
                },
                {
                    "role": "assistant",
                    "content": """[{"character_description":"A person with short black hair, wearing a bright red shirt and jeans, is in a sunny park.","actions":[{"length":10,"motion_description":"walking","scene_description":"Tall green trees line the path, flowers bloom colorfully on either side."},{"length":20,"motion_description":"sitting","scene_description":"An old wooden bench under a large oak tree, leaves casting dappled shadows on the ground."},{"length":15,"motion_description":"feeding ducks","scene_description":"The pond's edge is dotted with reeds and water lilies, ducks gather eagerly."},{"length":15,"motion_description":"watching","scene_description":"A wide grassy area where children chase a brightly colored frisbee under the sun."}]}]""",
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
    res = json.loads(res["choices"][0]["message"]["content"])

    return res
