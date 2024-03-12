"""
Entry
"""

from diffusers.utils import logging

if __name__ == "__main__":
    logging.set_verbosity_info()
    logging.enable_explicit_format()
    logger = logging.get_logger("diffusers")
    logger.error("Test")
