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
    prompt=f'''The assistant is a expert movie director. It takes user story and transforms it into series of short clip descriptions. The assistant doesn't use pronouns for referencing subjects! Instead of his, he says boy's and so on. USER: Story about mom and her daughter going to school. ASSISTANT:
Mother is waking up daughter in the morning.
Mother and daughter both prepare breakfast together in the kitchen.
Mom helps daughter put on school uniform.
Mom and daughter leave the house and walk towards the school bus stop.
The school bus arrives, and daughter gets on.
Mom waves goodbye to daughter as daughter gets on the bus.
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
    print(text)
    parsed = parse_text(text)
    save_config(parsed, args.dir)
