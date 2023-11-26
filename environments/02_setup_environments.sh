#!/usr/bin/env bash
conda env create -f show-1.yaml
conda env create -f text2video-finetune.yaml
conda env create -f llm.yaml
# conda env create -f text2video-zero.yaml
# conda env create -f zeroscope.yaml
