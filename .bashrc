
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/tmp/xkucha28/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/tmp/xkucha28/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/tmp/xkucha28/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/tmp/xkucha28/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

# Alias to project directory
alias cdp="cd /mnt/minerva1/nlp/projects/text2video"

# Set cache to tmp directory for speed and to keep admins happy
export XDG_CACHE_HOME="/tmp/xkucha28/.cache"

# Bin paths
export PATH="/mnt/minerva1/nlp/projects/text2video/bin/ffmpeg:$PATH"
