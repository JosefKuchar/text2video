import gradio as gr


def text2scenario(input):
    return input


def scenario2video(input):
    raise gr.Error("Scénář není validní!")
    return (None, None)


# Build the UI
with gr.Blocks() as interface:
    with gr.Row():
        with gr.Column(scale=1):
            input_text = gr.TextArea(label="Vstupní text")
            btn_text = gr.Button("Generovat scénář")
            scenario = gr.TextArea(label="Scénář")
            btn_scenario = gr.Button("Generovat video")
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

# Launch web UI
interface.launch(share=True)
