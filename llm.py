import sys
import os
import argparse
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

def generate_text(description: str) -> str:
    """Generates story from the given description."""
    # Setup model
    model_name_or_path = "TheBloke/WizardLM-13B-V1.2-GPTQ"
    model = AutoModelForCausalLM.from_pretrained(model_name_or_path,
                                                device_map="auto",
                                                trust_remote_code=False,
                                                revision="main")
    tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, use_fast=True)

    # Prompt template with example
    prompt=f'''The assistant is a expert movie director. It takes user story and transforms it into series of short clip descriptions. The assistant doesn't use pronouns to describe subjects! (for example his -> boy's, they -> mom and her daughter). USER: Story about mom and her daughter going to school. ASSISTANT:
Mother is waking up her daughter in the morning.
Mother and her daughter both prepare breakfast together in the kitchen.
Mom helps her daughter put on her school uniform.
Mom and her daughter leave the house and walk towards the school bus stop.
The school bus arrives, and they both get on.
Mom waves goodbye to her daughter as she gets on the bus.
The bus drives away with the daughter inside.
Mom watches the bus disappear down the street.
Mom goes back inside the house to start her day.</s>USER: {description}. ASSISTANT:
'''

    # Create pipeline
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        do_sample=True,
        #do_sample=True,
        #temperature=0.7,
        #top_k=40,
        #repetition_penalty=1.1,
        return_full_text=False
    )

    # Generate text
    return pipe(prompt)[0]['generated_text']

def parse_text(text: str):
    """Parse test from raw LLM output."""
    lines = text.splitlines()
    data = []
    for line in lines:
        # TODO: Different text2image and text2video prompts
        data.append({
            'text2image': line.strip(),
            'text2video': line.strip()
        })
    return data

def save_config(config, dir: str):
    """Save final config to the given directory."""
    os.makedirs(dir, exist_ok=True)
    with open(os.path.join(dir, 'text.json'), 'w') as f:
        json.dump(config, f)

if __name__ == '__main__':
    # TODO: Description
    parser = argparse.ArgumentParser()
    parser.add_argument('prompt', type=str, help='Prompt for the model')
    parser.add_argument('dir', type=str, help='Directory to save the output')
    args = parser.parse_args()
    text = generate_text(args.prompt)
    parsed = parse_text(text)
    save_config(parsed, args.dir)
