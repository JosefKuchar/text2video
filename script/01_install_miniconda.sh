#!/usr/bin/env bash
mkdir -p /tmp/xkucha28/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/xkucha28/miniconda3/miniconda.sh
bash /tmp/xkucha28/miniconda3/miniconda.sh -b -u -p /tmp/xkucha28/miniconda3
rm -rf /tmp/xkucha28/miniconda3/miniconda.sh
/tmp/xkucha28/miniconda3/bin/conda init bash
