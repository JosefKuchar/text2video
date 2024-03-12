"""
Various util functions
"""

def hex_to_tuple(color):
    """Convert hex color to tuple of floats between 0 and 1."""
    return tuple(int(color[i:i+2], 16) / 255 for i in (1, 3, 5))
