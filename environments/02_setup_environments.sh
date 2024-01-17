#!/usr/bin/env bash
#conda env create -f show-1.yaml
#conda create -y -n text2video-finetune python=3.10
#conda run -v -n text2video-finetune pip install -r text2video-finetune.txt
# conda create -y -n stable-video-diffusion python=3.10
# conda run -v -n stable-video-diffusion pip install -r stable-video-diffusion.txt
# conda create -y -n show-1 python=3.8
# conda run -v -n show-1 pip install -r show-1.txt --extra-index-url https://download.pytorch.org/whl/cu117
conda create -y -n vgen python=3.8
conda run -v -n vgen pip install torch==1.12.0+cu113 torchvision==0.13.0+cu113 torchaudio==0.12.0 --extra-index-url https://download.pytorch.org/whl/cu113
conda run -v -n vgen pip install -r vgen.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
# conda env create -f llm.yaml
# conda env create -f text2video-zero.yaml
# conda env create -f zeroscope.yaml
