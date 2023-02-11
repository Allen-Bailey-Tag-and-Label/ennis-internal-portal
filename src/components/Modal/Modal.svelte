<script>
  // imports
  import { current_component } from 'svelte/internal';
  import { twMerge } from 'tailwind-merge';
  import { getEvents, use as useAction } from '$actions';
  import { Button, Card, H6, Icon, Overlay, P } from '$components';
  import { X } from '$icons';
  import { theme } from 'sveltewind/stores';

  // handlers
  const close = () => (isOpen = false);

  // props (internal)
  const defaultClasses = '';
  const events = getEvents(current_component);

  // props (external)
  export let cancelHandler = () => {};
  export let confirmHandler = () => {};
  export let isOpen = false;
  export let showHeader = true;
  export let showOverlay = true;
  export let style = undefined;
  export let title = 'Modal Title';
  export let use = [];

  // props (dynamic)
  $: classes = twMerge(
    defaultClasses,
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
    $theme.modal,
    $$props.class
  );
</script>

<div {...$$restProps} class={classes} {style} use:useAction={[events, ...use]}>
  <slot name="overlay">
    {#if showOverlay}
      <Overlay on:click={close} class="cursor-pointer z-auto" />
    {/if}
  </slot>
  <slot>
    <Card class="z-[1] space-y-[1rem]">
      <slot name="header">
        {#if showHeader}
          <div class="flex items-center justify-between">
            <H6><slot name="title">{title}</slot></H6>
          </div>
        {/if}
      </slot>
      <slot name="body" />
      <slot name="footer">
        <div class="grid grid-cols-2 gap-[1rem]">
          <Button
            class="bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 focus:ring-gray-900/[.3] dark:bg-gray-50 dark:text-gray-800 dark:hover:bg-gray-200 dark:focus:bg-gray-200 dark:focus:ring-gray-100/[.3]"
            on:click={async () => {
              await cancelHandler();
              close();
            }}
            tabindex={!isOpen ? '-1' : undefined}
          >
            Cancel
          </Button>
          <Button
            on:click={async () => {
              await confirmHandler();
              close();
            }}
            tabindex={!isOpen ? '-1' : undefined}
          >
            OK
          </Button>
        </div>
      </slot>
    </Card>
  </slot>
</div>
