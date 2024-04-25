import gradio as gr
from gradio_scenario import Scenario


example = Scenario().example_value()
scenario = Scenario()

def x(value):
    return value

demo = gr.Interface(
    x,
    scenario,
    scenario,
)


if __name__ == "__main__":
    demo.launch()
