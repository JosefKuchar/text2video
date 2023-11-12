from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

model_name_or_path = "TheBloke/WizardLM-13B-V1.2-GPTQ"
model = AutoModelForCausalLM.from_pretrained(model_name_or_path,
                                             device_map="auto",
                                             trust_remote_code=False,
                                             revision="main")
tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, use_fast=True)

prompt=f'''The assistant is a expert movie director. It takes user story and transforms it into series of short clip descriptions. The assistant doesn't use pronouns to describe subjects! (for example his -> boy's, they -> mom and her daughter). USER: Story about mom and her daughter going to school. ASSISTANT:
Mother is waking up her daughter in the morning.
Mother and her daughter both prepare breakfast together in the kitchen.
Mom helps her daughter put on her school uniform.
Mom and her daughter leave the house and walk towards the school bus stop.
The school bus arrives, and they both get on.
Mom waves goodbye to her daughter as she gets on the bus.
The bus drives away with the daughter inside.
Mom watches the bus disappear down the street.
Mom goes back inside the house to start her day.</s>USER: Story about a boy who lost his toy car. ASSISTANT:
'''

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

generated_text = pipe(prompt)[0]['generated_text']
print(generated_text.splitlines())
