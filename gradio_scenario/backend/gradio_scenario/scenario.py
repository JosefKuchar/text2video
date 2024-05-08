"""
Scenario component backend

Author: Josef Kuchař
"""

from __future__ import annotations

from typing import Any, Callable

from gradio.components.base import FormComponent
from gradio.events import Events


class Scenario(FormComponent):
    """
    Custom scenario component for text2video
    """

    EVENTS = [
        Events.change,
        Events.input,
        Events.submit,
    ]

    def __init__(
        self,
        value: str | Callable | None = None,
        *,
        placeholder: str | None = None,
        label: str | None = None,
        every: float | None = None,
        show_label: bool | None = None,
        scale: int | None = None,
        min_width: int = 160,
        interactive: bool | None = None,
        visible: bool = True,
        rtl: bool = False,
        elem_id: str | None = None,
        elem_classes: list[str] | str | None = None,
        render: bool = True,
    ):
        self.placeholder = placeholder
        self.rtl = rtl
        super().__init__(
            label=label,
            every=every,
            show_label=show_label,
            scale=scale,
            min_width=min_width,
            interactive=interactive,
            visible=visible,
            elem_id=elem_id,
            elem_classes=elem_classes,
            value=value,
            render=render,
        )

    def preprocess(self, payload) -> str | None:
        if payload is None:
            return None

        # Strip id fields
        for scene in payload:
            del scene["id"]
            for action in scene["actions"]:
                del action["id"]

        return payload

    def postprocess(self, value) -> str | None:
        if value is None:
            return None

        # Add id fields
        id = 0
        for scene in value:
            scene["id"] = id
            id += 1
            action_id = 0
            for action in scene["actions"]:
                action["id"] = action_id
                action_id += 1

        return value

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def example_payload(self) -> Any:
        return "[]"

    def example_value(self) -> Any:
        return "[]"
