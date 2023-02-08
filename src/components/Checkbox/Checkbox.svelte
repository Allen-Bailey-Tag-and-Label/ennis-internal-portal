<script lang="ts">
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { Icon } from '$components';
  import { Check } from '$icons';

  // props (checked)
  export let checked = true;

  // props (dynamic)
  $: checkedClasses = !checked ? '' : 'bg-primary-500 dark:bg-primary-500';
  $: classes = twMerge(
    $theme.input,
    'mr-[.5rem] px-0 py-0 w-[1.75rem] h-[1.75rem] text-white flex items-center justify-center peer-focus:ring-primary-500/[.3]',
    checkedClasses,
    $$props.class
  );
</script>

<label class="flex justify-start items-center relative cursor-pointer">
  <input
    bind:checked
    class="absolute top-0 left-0 w-0 h-0 opacity-0 peer"
    type="checkbox"
    {...$$restProps}
  />
  <slot name="handle">
    <div class={classes}>
      <Icon class="transition duration-200 {!checked ? 'scale-0' : 'scale-100'}" src={Check} />
    </div>
  </slot>
  <slot />
</label>
