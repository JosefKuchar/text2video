from util import get_overlap
from compel import Compel
import torch
from tqdm import tqdm
import logging

logger = logging.getLogger(__name__)


class EmbedManager:
    """
    Manage embeds for the whole video
    """

    video_len: int
    compel: Compel
    embeds: list[tuple[torch.Tensor, int]]

    def __init__(self, video_len, tokenizer, text_encoder):
        self.video_len = video_len
        self.compel = Compel(tokenizer=tokenizer, text_encoder=text_encoder)
        self.embeds = []

    def precompute_embeds(self, prompts: list[tuple[str, int]]):
        """
        Precompute the conditioning tensors for a list of prompts

        :param prompts: list of tuples of (prompt, starting frame)
        :return: list of tuples of (conditioning tensor, starting frame)
        """

        logger.info("Precomputing conditioning tensors")
        for prompt in tqdm(prompts):
            conditioning = self.compel.build_conditioning_tensor(prompt[0])
            self.embeds.append((conditioning, prompt[1]))

    def get_embed_window(self, start: int, stop: int) -> torch.Tensor:
        """
        Get the conditioning tensor for a given window of frames

        :param embeds: list of tuples of (conditioning tensor, starting frame)
        :param start: starting frame
        :param stop: ending frame
        :return: conditioning tensor
        """

        tensors = []
        for embed_index, embed in enumerate(self.embeds):
            # Next conditioning tensor index
            next_embed_index = (
                self.embeds[embed_index + 1][1]
                if embed_index + 1 < len(self.embeds)
                else self.video_len
            )
            # We are after stop, so we can break
            if embed[1] >= stop:
                break
            # Calculate the overlap between the current conditioning tensor and the window
            n = get_overlap((start, stop), (embed[1], next_embed_index))
            if n == 0:
                continue
            # Repeat the current conditioning tensor n times
            tensors.append(embed[0].repeat_interleave(repeats=n, dim=0))
        return torch.cat(tensors, dim=0)
