#!/usr/bin/env bash
#conda env create -f show-1.yaml
#conda create -y -n text2video-finetune python=3.10
#conda run -v -n text2video-finetune pip install -r text2video-finetune.txt
conda create -y -n stable-video-diffusion python=3.10
conda run -v -n stable-video-diffusion pip install -r stable-video-diffusion.txt
#conda env create -f llm.yaml
# conda env create -f text2video-zero.yaml
# conda env create -f zeroscope.yaml
