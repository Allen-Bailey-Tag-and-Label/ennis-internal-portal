<script lang="ts">
  import { current_component } from 'svelte/internal';
  import { twMerge } from 'tailwind-merge';
  import { getEvents } from '$actions';
  import { applyAction, enhance } from '$app/forms';
  import { Button, Card, Form, H6, Overlay, ProgressIndicator } from '$components';
  import { theme } from 'sveltewind/stores';

  // handlers
  const close = () => (isOpen = false);

  // props (internal)
  const defaultClasses = 'max-w-none';
  const events = getEvents(current_component);

  // props (external)
  export let action: string | undefined = undefined;
  export let cancelHandler = () => {};
  export let disabled = false;
  export let isOpen = false;
  export let method = 'post';
  export let showHeader = true;
  export let showOverlay = true;
  export let style: string | undefined = undefined;
  export let submitHandler: Function | undefined = undefined;
  export let submitted = false;
  export let title = 'Modal Title';
  export let use: any[] = [
    [
      enhance,
      () => {
        submitted = true;

        return async ({ result }) => {
          isOpen = false;
          submitted = false;
          await applyAction(result);
        };
      }
    ]
  ];

  // props (dynamic)
  $: classes = twMerge(
    defaultClasses,
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
    $theme.modal,
    $$props.class
  );
</script>

<Form
  {...$$restProps}
  {action}
  class={classes}
  disabled={disabled || submitted ? 'disabled' : undefined}
  {method}
  on:submit={submitHandler}
  {style}
  use={[events, ...use]}
>
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
        <div class="grid gap-[1rem] {!submitted ? 'grid-cols-2' : 'grid-cols-1'}">
          {#if !submitted}
            <Button
              class="bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 focus:ring-gray-900/[.3] dark:bg-gray-50 dark:text-gray-800 dark:hover:bg-gray-200 dark:focus:bg-gray-200 dark:focus:ring-gray-100/[.3]"
              {disabled}
              on:click={async () => {
                await cancelHandler();
                close();
              }}
              tabindex={!isOpen ? '-1' : undefined}
            >
              Cancel
            </Button>
          {/if}
          <Button {disabled} tabindex={!isOpen ? '-1' : undefined} type="submit">
            {#if !submitted}
              OK
            {:else}
              <ProgressIndicator class="w-[1.5rem] h-[1.5rem]" />
            {/if}
          </Button>
        </div>
      </slot>
    </Card>
  </slot>
</Form>
