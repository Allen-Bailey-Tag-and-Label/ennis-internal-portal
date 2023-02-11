<script lang="ts">
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { Card, Checkbox, Icon, Input, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { ChevronDown } from '$icons';

  // handlers
  const thClickHandler = ({ key }: { key: string }) => {
    if (key !== sort?.key) sort = { key, direction: -1 };

    sort.direction = sort.direction * -1;
    sortHandler();
  };

  // utilities
  const tdClasses = ({ classes, type }) =>
    twMerge(
      type === 'checkbox' ? 'py-[.375rem]' : '',
      type === 'input' ? 'px-0 py-0 ring-0' : '',
      classes
    );
  const thClasses = ({ classes, key, type }) => twMerge('pr-[3.5rem]', classes);

  // props (external)
  export let columns: {
    checked?: boolean;
    changeHandler?: Function;
    classes?: string;
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

  // lifecycle
  // onMount(() => {
  //   columns = columns.map((column) => {
  //     if (column?.type === 'checkbox') column.checked = column?.checked || false;
  //     return column;
  //   });
  //   sort = { key: columns[0].key, direction: 1, ...sort };
  //   sortHandler();
  // });
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
          {:else if type === 'input' || type === 'string'}
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
            <Td class={tdClasses({ classes: row?.classes, type })}>
              {#if type === 'checkbox'}
                <Checkbox bind:checked={row[key]} on:change={row?.changeHandler} />
              {:else if type === 'input'}
                <Input
                  class="w-full rounded-none focus:bg-primary-500/[.15] dark:focus:bg-primary-500/[.1]"
                  bind:value={row[key]}
                />
              {:else if type === 'string'}
                {row[key]}
              {/if}
            </Td>
          {/each}
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
