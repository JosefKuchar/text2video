import gradio as gr
from gradio_scenario import Scenario


example = Scenario().example_value()

demo = gr.Interface(
    lambda x: x,
    Scenario(),  # interactive version of your component
    Scenario(),  # static version of your component
    # examples=[[example]],  # uncomment this line to view the "example version" of your component
)


if __name__ == "__main__":
    demo.launch(share=True)
