<script lang="ts">
  import { current_component } from 'svelte/internal';
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { getEvents, use as useAction } from '$actions';
  import { Icon } from '$components';
  import { Check, Minus } from '$icons';

  // props (internal)
  const events = getEvents(current_component);

  // props (external)
  export let checked: boolean | string = false;
  export let use = [];

  // props (dynamic)
  $: checkedClasses = !checked ? '' : 'bg-primary-500 dark:bg-primary-500';
  $: classes = twMerge($theme.checkbox, checkedClasses, $$props.class);
</script>

<label class="flex justify-start items-center relative cursor-pointer">
  <input
    {...$$restProps}
    bind:checked
    class="absolute top-0 left-0 w-0 h-0 opacity-0 peer"
    type="checkbox"
    use:useAction={[events, ...use]}
  />
  <slot name="handle">
    <div class={classes}>
      <Icon
        class="transition duration-200 {!checked ? 'scale-0' : 'scale-100'}"
        src={checked === true || checked === false ? Check : Minus}
      />
    </div>
  </slot>
  <slot />
</label>
