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
            "scenes": {
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
        n_ctx=32768,
        n_batch=32768,
        verbose=False,
    )

    logger.info("Generating scenario based on prompt")

    # return {
    #     "character_description": "The person is in their mid-30s, with short, curly hair, wearing a bright red shirt, denim jeans, and comfortable walking shoes. They have a warm smile, carry a small backpack, and wear sunglasses on a sunny day in the park.",
    #     "scenes": [
    #         {
    #             "length": 15,
    #             "motion_description": "The person is walking slowly, taking in the surroundings, occasionally stopping to admire flowers.",
    #             "scene_description": "The park is vibrant with the colors of various flowers and the lush green of the grass. The sun is shining brightly, casting playful shadows through the leaves of tall trees. Children are playing in the distance, and there's a gentle breeze.",
    #         },
    #         {
    #             "length": 15,
    #             "motion_description": "The person sits on a bench, takes out a book from their backpack, and begins to read.",
    #             "scene_description": "The bench is located under a large oak tree, providing a perfect blend of sunlight and shade. The scene is peaceful, with the occasional sound of birds chirping and leaves rustling. People are walking by, some with their dogs, creating a lively atmosphere.",
    #         },
    #         {
    #             "length": 15,
    #             "motion_description": "A small dog approaches the person, who puts the book down to pet it.",
    #             "scene_description": "The small dog, a friendly golden retriever puppy, wags its tail excitedly as it gets petted. The person laughs and plays with the puppy, attracting the attention of a few passersby who smile at the scene.",
    #         },
    #         {
    #             "length": 15,
    #             "motion_description": "After the dog leaves, the person resumes reading, occasionally sipping from a water bottle.",
    #             "scene_description": "The person is once again engrossed in their book, relaxed and enjoying the serenity of the park. The sunlight has shifted, creating a warm, golden hue across the scene, signaling the approach of late afternoon. The park remains a hub of quiet activity, encapsulating a perfect day out.",
    #         },
    #     ],
    # }

    # Generate scenario based on prompt
    with yaspin(text="Generating scenario based on prompt"):
        res = llm.create_chat_completion(
            messages=[
                {
                    "role": "user",
                    "content": """You are a helpful assistant that outputs in JSON.

        Here are details about the JSON object you need to create:

        'character_description' is a description of the character in all scenes
        'length' is the duration of the scene in seconds
        'motion_description' is a description of the motion in the scene
        'scene_description' is a visual description of the scene
        Create story about a person in a park, approximately 1 minute long. It is sunny and the person is wearing a red shirt.""",
                },
                {
                    "role": "assistant",
                    "content": """{"character_description":"The person is in their mid-30s, with short, curly hair, wearing a bright red shirt, denim jeans, and comfortable walking shoes. They have a warm smile, carry a small backpack, and wear sunglasses on a sunny day in the park.","scenes":[{"length":15,"motion_description":"The person is walking slowly, taking in the surroundings, occasionally stopping to admire flowers.","scene_description":"The park is vibrant with the colors of various flowers and the lush green of the grass. The sun is shining brightly, casting playful shadows through the leaves of tall trees. Children are playing in the distance, and there's a gentle breeze."},{"length":15,"motion_description":"The person sits on a bench, takes out a book from their backpack, and begins to read.","scene_description":"The bench is located under a large oak tree, providing a perfect blend of sunlight and shade. The scene is peaceful, with the occasional sound of birds chirping and leaves rustling. People are walking by, some with their dogs, creating a lively atmosphere."},{"length":15,"motion_description":"A small dog approaches the person, who puts the book down to pet it.","scene_description":"The small dog, a friendly golden retriever puppy, wags its tail excitedly as it gets petted. The person laughs and plays with the puppy, attracting the attention of a few passersby who smile at the scene."},{"length":15,"motion_description":"After the dog leaves, the person resumes reading, occasionally sipping from a water bottle.","scene_description":"The person is once again engrossed in their book, relaxed and enjoying the serenity of the park. The sunlight has shifted, creating a warm, golden hue across the scene, signaling the approach of late afternoon. The park remains a hub of quiet activity, encapsulating a perfect day out."}]}""",
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
