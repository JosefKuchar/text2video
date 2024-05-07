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

    def __init__(self, video_len, character_description, tokenizer, text_encoder):
        self.video_len = video_len
        self.compel = Compel(tokenizer=tokenizer, text_encoder=text_encoder)
        self.character_description = character_description
        self.embeds = []

    def precompute_embeds(self, prompts: list[tuple[str, str, int]]):
        """
        Precompute the conditioning tensors for a list of prompts

        :param prompts: list of tuples of (scene description, motion description, ending frame)
        :return: list of tuples of (conditioning tensor, ending frame)
        """

        logger.info("Precomputing conditioning tensors")
        for prompt in tqdm(prompts):
            # Character description, motion description, scene description
            query = f"{self.character_description}, {prompt[1]}, {prompt[0]}"
            conditioning = self.compel.build_conditioning_tensor(query)
            self.embeds.append((conditioning, prompt[2]))

    def get_embed_window(self, start: int, stop: int) -> torch.Tensor:
        """
        Get the conditioning tensor for a given window of frames

        :param embeds: list of tuples of (conditioning tensor, ending frame)
        :param start: starting frame
        :param stop: ending frame
        :return: conditioning tensor
        """

        tensors = []
        for embed_index, embed in enumerate(self.embeds):
            # Next conditioning tensor index
            prev_embed_index = self.embeds[embed_index - 1][1] if embed_index > 0 else 0
            # We are after stop, so we can break
            if prev_embed_index >= stop:
                break
            # Calculate the overlap between the current conditioning tensor and the window
            n = get_overlap((start, stop), (prev_embed_index, embed[1]))
            if n == 0:
                continue
            # Repeat the current conditioning tensor n times
            tensors.append(embed[0].repeat_interleave(repeats=n, dim=0))
        return torch.cat(tensors, dim=0)

    def get_negative_embeds(self) -> torch.Tensor:
        """
        Get negative conditioning tensors for the whole video
        """

        general_negative = "worst quality, low quality"
        negative_embeds = self.compel.build_conditioning_tensor(
            # f'("{general_negative}","{general_negative}","{general_negative}").and()"'
            f"{general_negative}"
        )
        return negative_embeds.repeat_interleave(repeats=self.video_len, dim=0)
