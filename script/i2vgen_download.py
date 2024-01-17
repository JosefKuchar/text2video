from modelscope.hub.snapshot_download import snapshot_download
model_dir = snapshot_download('damo/I2VGen-XL', cache_dir='/tmp/xkucha28/models/', revision='v1.0.0')
