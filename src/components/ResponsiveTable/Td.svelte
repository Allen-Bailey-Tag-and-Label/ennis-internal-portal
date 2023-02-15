<script lang="ts">
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { Checkbox, Input, Td } from '$components';

  // utilities
  const tdClasses = () =>
    twMerge(
      type === 'checkbox' ? 'py-[.375rem]' : '',
      type === 'date' || type === 'input' || type === 'int' ? 'relative px-0 py-0 ring-0' : '',
      $$props.class
    );

  // props (internal)
  let clientWidth: number = 0;
  let style: string | undefined = undefined;

  // props (external)
  export let key: string = '';
  export let type: string = 'input';
  export let value: any = '';

  // props (dynamic)
  $: if (type === 'input') {
    style = `min-width: ${clientWidth}px`;
  }
</script>

<Td class={tdClasses()} {style}>
  {#if type === 'checkbox'}
    <Checkbox bind:checked={value} on:change={$$props?.changeHandler?.({ key, value })} />
  {/if}
  {#if type === 'date'}
    <Input
      bind:value
      class="py-[calc(1rem_*_11_/_26)] w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] dark:[color-scheme:dark]"
      on:change={$$props?.changeHandler?.({ key, value })}
      type="date"
    />
  {/if}
  {#if type === 'input'}
    <Input
      bind:value
      class="w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1]"
      on:change={$$props?.changeHandler?.({ key, value })}
      size={value.length > 0 ? value.length : '1'}
    />
  {/if}
  {#if type === 'int'}
    <Input
      bind:value
      class="w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] lg:hidden"
      on:change={$$props?.changeHandler?.({ key, value })}
      size={value.length > 0 ? value.length : '1'}
      type="tel"
    />
    <Input
      bind:value
      class="w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1] hidden lg:block"
      on:change={$$props?.changeHandler?.({ key, value })}
      size={value.length > 0 ? value.length : '1'}
      type="number"
    />
  {/if}
  {#if type === 'string'}
    {value}
  {/if}
</Td>
