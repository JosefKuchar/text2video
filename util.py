"""
Various util functions
"""

import cv2
import numpy as np


def hex_to_tuple(color):
    """Convert hex color to tuple of floats between 0 and 1."""
    return tuple(int(color[i : i + 2], 16) / 255 for i in (1, 3, 5))


def pil_to_cv2(image):
    """Convert PIL image to OpenCV image."""

    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def cv2_to_pil(image):
    """Convert OpenCV image to PIL image."""

    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
