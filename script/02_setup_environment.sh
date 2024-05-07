#!/usr/bin/env bash
# Get script directory and change to the project directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/..
# Create the conda environment for the project
conda create -y -n text2video python=3.10
# Install most of the dependencies
conda run -v -n text2video pip install -r script/requirements.txt
# Install en_core_web_sm using spacy
conda run -v -n text2video python -m spacy download en_core_web_sm
# Install custom gradio scenario component
conda run -v -n text2video pip install -e gradio_scenario
# Install custom diffusers version
conda run -v -n text2video pip install -e diffusers
