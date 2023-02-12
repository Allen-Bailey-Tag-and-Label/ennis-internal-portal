<script lang="ts">
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { Checkbox, Input, Td } from '$components';

  // utilities
  const tdClasses = () =>
    twMerge(
      type === 'checkbox' ? 'py-[.375rem]' : '',
      type === 'input' ? 'relative px-0 py-0 ring-0' : '',
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
    style = `width: ${clientWidth}px`;
  }
</script>

<Td class={tdClasses()} {style}>
  {#if type === 'checkbox'}
    <Checkbox bind:checked={value} on:change={$$props?.changeHandler?.({ key, value })} />
  {/if}
  {#if type === 'input'}
    <Input
      bind:value
      class="w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1]"
      on:change={$$props?.changeHandler?.({ key, value })}
    />
    <div
      bind:clientWidth
      class={twMerge($theme.input, 'absolute top-0 left-0 opacity-0 pointer-events-none')}
    >
      {value}
    </div>
  {/if}
  {#if type === 'string'}
    {value}
  {/if}
</Td>
