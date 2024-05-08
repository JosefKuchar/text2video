"""
Various util functions

Author: Josef Kuchař
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


def get_overlap(a: tuple[int, int], b: tuple[int, int]):
    """Get number of overlapping elements between two ranges."""

    return max(0, min(a[1], b[1]) - max(a[0], b[0]))


class dotdict(dict):
    """Dictionary with dot access to keys."""

    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__
