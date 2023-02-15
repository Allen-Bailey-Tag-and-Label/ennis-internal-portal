<script lang="ts">
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { Card, Checkbox, Icon, Input, Table, Tbody, Th, Thead, Tr } from '$components';
  import { ChevronDown } from '$icons';
  import Td from './Td.svelte';

  // handlers
  const thClickHandler = ({ key }: { key: string }) => {
    if (key !== sort?.key) sort = { key, direction: -1 };

    sort.direction = sort.direction * -1;
    sortHandler();
  };

  // utilities
  const thClasses = ({ classes, key, type }: { classes?: string; key: string; type: string }) =>
    twMerge('pr-[3.5rem]', classes);

  // props (external)
  export let columns: {
    checked?: boolean;
    changeHandler?: ((e: CustomEvent<any>) => void) | null | undefined;
    classes?: string | undefined;
    editable?: boolean;
    key: string;
    th: string;
    type?: string;
  }[] = [];
  export let rows: { [key: string]: any }[] = [];
  export let sort: { key: string; direction: number } | undefined = undefined;
  export const sortHandler = () =>
    (rows = rows.sort((a, b) => {
      // check if key is undefined
      if (sort?.key === undefined) return 0;

      // initiate value
      let value = 0;

      // compare values
      if (a[sort.key] < b[sort.key]) value = -1;
      if (a[sort.key] > b[sort.key]) value = 1;

      // apply sort direction
      value *= sort.direction;

      return value;
    }));

  // props (dynamic)
  $: classes = twMerge(
    'overflow-auto bg-transparent dark:bg-transparent relative px-0 py-0 rounded-none self-start max-w-full',
    $$props.class
  );
  $: if (rows.length > 0 && sort === undefined && columns.length > 0) {
    sort = { key: [...columns].filter(({ key }) => key !== 'dtSelect')[0].key, direction: 1 };
    sortHandler();
  }
</script>

<Card class={classes}>
  <Table>
    <Thead>
      {#each columns as { checked = false, changeHandler = undefined, classes = undefined, key, th, type = 'string' }}
        <Th class={thClasses({ classes, key, type })} on:click={() => thClickHandler({ key })}>
          {#if type === 'checkbox'}
            <Checkbox
              bind:checked
              class={twMerge(
                'ring-offset-white hover:ring-offset-white peer-focus:ring-offset-white peer-focus:ring-white/[.3] dark:ring-offset-white dark:hover:ring-offset-white dark:peer-focus:ring-offset-white dark:peer-focus:ring-white/[.3]',
                !checked ? 'text-white' : 'text-white'
              )}
              on:change={changeHandler}
            >
              {th}
            </Checkbox>
          {:else if type === 'date' || type === 'input' || type === 'int' || type === 'string'}
            {th}
          {/if}
          {#if key === sort?.key}
            <Icon
              class="absolute top-1/2 -translate-y-1/2 right-[1.5rem] transition duration-200 {sort?.direction ===
              1
                ? 'rotate-0'
                : 'rotate-180'}"
              src={ChevronDown}
            />
          {/if}
        </Th>
      {/each}
    </Thead>
    <Tbody>
      {#each rows as row}
        <Tr>
          {#each columns as { key, type = "string" }}
            <Td {...row} bind:value={row[key]} {key} {type} />
          {/each}
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
