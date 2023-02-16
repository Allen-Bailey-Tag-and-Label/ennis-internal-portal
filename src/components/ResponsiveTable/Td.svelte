<script lang="ts">
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { Checkbox, Input, MultipleInput, Td } from '$components';

  // utilities
  const tdClasses = () =>
    twMerge(
      'h-[inherit]',
      type === 'checkbox' ? 'py-[.375rem]' : '',
      type === 'date' || type === 'input' || type === 'int' || type === 'multipleInput'
        ? 'relative px-0 py-0 ring-0'
        : '',
      $$props.class
    );

  // props (internal)
  let clientWidth: number = 0;
  let style: string | undefined = undefined;

  // props (external)
  export let key: string = '';
  export let row: {} = {};
  export let type: string = 'input';
  export let value: any = '';

  // props (dynamic)
  $: if (type === 'input') {
    style = `min-width: ${clientWidth}px`;
  }
</script>

<Td class={tdClasses()} {style}>
  {#if type === 'checkbox'}
    <Checkbox
      bind:checked={value}
      class={$$props.class}
      on:change={$$props?.changeHandler?.({ key, row, value })}
    />
  {/if}
  {#if type === 'date'}
    <Input
      bind:value
      class="h-full py-[calc(1rem_*_11_/_26)] min-w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] dark:[color-scheme:dark] {$$props.class}"
      on:change={$$props?.changeHandler?.({ key, row, value })}
      type="date"
    />
  {/if}
  {#if type === 'input'}
    <Input
      bind:value
      class="h-full min-w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] {$$props.class}"
      on:change={$$props?.changeHandler?.({ key, row, value })}
      size={value.length > 0 ? Math.ceil(value.length * (23.25 / 22)) : '1'}
    />
  {/if}
  {#if type === 'int'}
    <Input
      bind:value
      class="h-full min-w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] lg:hidden {$$props.class}"
      on:change={$$props?.changeHandler?.({ key, row, value })}
      size={value.length > 0 ? Math.ceil(value.length * (23.25 / 22)) : '1'}
      type="tel"
    />
    <Input
      bind:value
      class="h-full min-w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] hidden lg:block {$$props.class}"
      on:change={$$props?.changeHandler?.({ key, row, value })}
      size={value.length > 0 ? Math.ceil(value.length * (23.25 / 22)) : '1'}
      type="number"
    />
  {/if}
  {#if type === 'multipleInput'}
    <MultipleInput
      bind:value
      class="rounded-none {$$props.class}"
      on:change={$$props?.changeHandler?.({ key, row, value })}
      options={$$props.options}
    />
  {/if}
  {#if type === 'string'}
    {value}
  {/if}
</Td>
