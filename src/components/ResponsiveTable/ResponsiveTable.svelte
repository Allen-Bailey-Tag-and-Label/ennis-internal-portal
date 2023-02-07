<script lang="ts">
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { Card, Icon, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { ChevronDown } from '$icons';

  // handlers
  const thClickHandler = ({ key }: { key: string }) => {
    if (key !== sort?.key) sort = { key, direction: -1 };

    sort.direction = sort.direction * -1;
    sortRows();
  };

  // utilities
  const sortRows = () =>
    (rows = rows.sort((a, b) =>
      sort?.key === undefined
        ? 0
        : (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.direction
    ));

  // props (external)
  export let columns: { key: string; th: string }[] = [];
  export let rows: { [key: string]: any }[] = [];
  export let sort: { key: string; direction: number } | undefined = undefined;

  // props (dynamic)
  $: classes = twMerge(
    'overflow-auto bg-transparent dark:bg-transparent relative px-0 py-0 rounded-none',
    $$props.class
  );

  // lifecycle
  onMount(() => {
    sort = { key: columns[0].key, direction: 1 };
    sortRows();
  });
</script>

<Card class={classes}>
  <Table>
    <Thead>
      {#each columns as { key, th }}
        <Th
          class="relative {key !== sort?.key ? '' : 'pr-[3.5rem]'}"
          on:click={() => thClickHandler({ key })}
        >
          {th}
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
          {#each columns as { key }}
            <Td>{row[key]}</Td>
          {/each}
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
