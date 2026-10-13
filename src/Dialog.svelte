<script lang="ts">
  import type { Snippet } from "svelte";
  import { Dialog, type WithoutChild } from "bits-ui";
  import XIcon from "phosphor-svelte/lib/XIcon";

  type Props = Dialog.RootProps & {
    buttonText: string;
    title: Snippet;
    description: Snippet;
    contentProps?: WithoutChild<Dialog.ContentProps>;
    // ...other component props if you wish to pass them
  };

  let {
    open = $bindable(false),
    children,
    buttonText,
    contentProps,
    title,
    description,
    ...restProps
  }: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
  <Dialog.Trigger>
    {buttonText}
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="dialog-overlay" />
    <Dialog.Content class="dialog-content" {...contentProps}>
      <Dialog.Title>
        {@render title()}
      </Dialog.Title>
      <Dialog.Description>
        {@render description()}
      </Dialog.Description>
      {@render children?.()}
      <Dialog.Close class="dialog-close"><XIcon /></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.dialog-overlay) {
    position: fixed;
    inset: 0;
    background: rgba(30, 30, 28, 0.34);
  }

  :global(.dialog-content) {
    position: fixed;
    inset: 0;
    margin: auto;
    width: 60%;
    height: fit-content;
    max-height: 80%;
    background: white;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  :global(.dialog-close) {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
