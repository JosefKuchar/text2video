<svelte:options accessors={true} />

<script lang="ts">
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import type { Gradio } from "@gradio/utils";
  import { Trash, Copy, Check } from "@gradio/icons";
  import { BlockTitle } from "@gradio/atoms";
  import { Block } from "@gradio/atoms";
  import { StatusTracker } from "@gradio/statustracker";
  import type { LoadingStatus } from "@gradio/statustracker";
  import { BaseButton } from "@gradio/button";
  import BaseTextbox from "./Textbox.svelte";

  /* https://www.svgrepo.com/svg/439744/drag-horizontal */

  export let gradio: Gradio<{
    change: never;
    submit: never;
    input: never;
  }>;
  export let label = "Textbox";
  export let elem_id = "";
  export let elem_classes: string[] = [];
  export let visible = true;
  export let value = [];
  export let placeholder = "";
  export let show_label: boolean;
  export let scale: number | null = null;
  export let min_width: number | undefined = undefined;
  export let loading_status: LoadingStatus | undefined = undefined;
  export let value_is_output = false;
  export let interactive: boolean;
  export let rtl = false;

  let el: HTMLTextAreaElement | HTMLInputElement;
  let copied = false;
  let timer;
  const container = true;
  let id = 0;

  $: {
    // Find the max id and increment it by 1
    id =
      value.reduce((acc, scene) => {
        return Math.max(
          acc,
          scene.id,
          ...scene.actions.map((action) => action.id)
        );
      }, 0) + 1;
    console.log("id", id);
  }

  function handle_change(): void {
    gradio.dispatch("change");
    if (!value_is_output) {
      gradio.dispatch("input");
    }
  }

  function copy_feedback(): void {
    copied = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied = false;
    }, 1000);
  }

  async function handle_copy(): Promise<void> {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
      copy_feedback();
    }
  }

  function handleConsider(e, sceneIndex = undefined) {
    console.log("e", e);
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    if (typeof sceneIndex !== "undefined") {
      value[sceneIndex].actions = newItems;
    } else {
      value = newItems;
    }

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }
  function handleFinalize(e, sceneIndex = undefined) {
    const {
      items: newItems,
      info: { source },
    } = e.detail;

    if (typeof sceneIndex !== "undefined") {
      value[sceneIndex].actions = newItems;
    } else {
      value = newItems;
    }

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  }
  function startDrag(e) {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    dragDisabled = false;
  }

  const flipDurationMs = 200;
  let dragDisabled = true;

  $: value, handle_change();
  $: console.log("value", value);
</script>

<Block
  {visible}
  {elem_id}
  {elem_classes}
  {scale}
  {min_width}
  allow_overflow={false}
  padding={true}
>
  {#if loading_status}
    <StatusTracker
      autoscroll={gradio.autoscroll}
      i18n={gradio.i18n}
      {...loading_status}
    />
  {/if}

  <BlockTitle {show_label} info={undefined}>{label}</BlockTitle>
  <div
    class="scroll"
    use:dndzone={{ items: value, dragDisabled, flipDurationMs, type: "scene" }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each value as scene, i (scene.id)}
      <div class="scene">
        <div class="scene-header">
          <div class="scene-title">Scene #{i + 1}</div>
          <div class="scene-actions">
            <BaseButton
              on:click={() => {
                value = value.filter((_, index) => index !== i);
              }}><div class="icon-button"><Trash /></div></BaseButton
            >
            <div
              tabindex={dragDisabled ? 0 : -1}
              aria-label="drag-handle"
              class="handle"
              style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
              on:mousedown={startDrag}
              on:touchstart={startDrag}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g><g id="SVGRepo_iconCarrier">
                  <path
                    d="M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"
                    fill="#000000"
                  ></path>
                  <path
                    d="M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"
                    fill="#000000"
                  ></path>
                </g></svg
              >
            </div>
          </div>
        </div>
        <BaseTextbox
          type="text"
          label="Character description"
          bind:value={value[i].character_description}
          {placeholder}
          on:input={handle_change}
          disabled={!interactive}
          dir={rtl ? "rtl" : "ltr"}
        />
        <div
          class="actions"
          use:dndzone={{
            items: scene.actions,
            dragDisabled,
            flipDurationMs,
            type: "action",
          }}
          on:consider={(e) => handleConsider(e, i)}
          on:finalize={(e) => handleFinalize(e, i)}
        >
          {#each scene.actions as action, j (action.id)}
            <div>
              <div class="scene-header">
                <div class="scene-title">Action #{j + 1}</div>
                <div class="scene-actions">
                  <BaseButton
                    on:click={() => {
                      value[i].actions = value[i].actions.filter(
                        (_, index) => index !== j
                      );
                    }}><div class="icon-button"><Trash /></div></BaseButton
                  >
                  <div
                    tabindex={dragDisabled ? 0 : -1}
                    aria-label="drag-handle"
                    class="handle"
                    style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                    on:mousedown={startDrag}
                    on:touchstart={startDrag}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g><g id="SVGRepo_iconCarrier">
                        <path
                          d="M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"
                          fill="#000000"
                        ></path>
                      </g></svg
                    >
                  </div>
                </div>
              </div>
              <BaseTextbox
                type="number"
                max_lines={1}
                label="Length"
                bind:value={value[i].actions[j].length}
                {placeholder}
                on:input={handle_change}
                disabled={!interactive}
                dir={rtl ? "rtl" : "ltr"}
              />
              <BaseTextbox
                type="text"
                label="Motion description"
                bind:value={value[i].actions[j].motion_description}
                {placeholder}
                on:input={handle_change}
                disabled={!interactive}
                dir={rtl ? "rtl" : "ltr"}
              />
              <BaseTextbox
                type="text"
                label="Scene description"
                bind:value={value[i].actions[j].scene_description}
                {placeholder}
                on:input={handle_change}
                disabled={!interactive}
                dir={rtl ? "rtl" : "ltr"}
              />
              <hr class="hr-action" />
            </div>
          {/each}
          <BaseButton
            on:click={() => {
              value[i].actions = [
                ...value[i].actions,
                {
                  length: null,
                  motion_description: "",
                  scene_description: "",
                  id: id++,
                },
              ];
              value = value;
            }}>New action</BaseButton
          >
        </div>
        <hr class="hr-scene" />
      </div>
    {/each}
    <BaseButton
      on:click={() => {
        value = [
          ...value,
          {
            character_description: "",
            actions: [],
            id: id++,
          },
        ];
        console.log(value);
      }}>New scene</BaseButton
    >
  </div>
  <button
    on:click={handle_copy}
    title="copy"
    class="json-copy-button"
    aria-roledescription={copied ? "Copied value" : "Copy value"}
    aria-label={copied ? "Copied" : "Copy"}
  >
    {#if copied}
      <Check />
    {:else}
      <Copy />
    {/if}
  </button>
</Block>

<style>
  .icon-button {
    width: 24px;
    height: 24px;
  }

  .scene-title {
    font-weight: bold;
  }

  .scene-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hr-scene {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-top: 1px solid #ccc;
  }

  .hr-action {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-top: 1px solid #ccc;
  }

  .actions {
    margin: 1rem;
  }

  .json-copy-button {
    display: flex;
    position: absolute;
    top: var(--block-label-margin);
    right: var(--block-label-margin);
    align-items: center;
    box-shadow: var(--shadow-drop);
    border: 1px solid var(--border-color-primary);
    border-top: none;
    border-right: none;
    border-radius: var(--block-label-right-radius);
    background: var(--block-label-background-fill);
    padding: 6px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    color: var(--block-label-text-color);
    font: var(--font);
    font-size: var(--button-small-text-size);
  }

  .scroll {
    max-height: 60vh;
    overflow-y: auto;
  }

  .handle {
    width: 2em;
  }

  .scene {
    background: white;
  }

  .scene-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
</style>
