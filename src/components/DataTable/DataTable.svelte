<script lang="ts">
  import { onMount } from 'svelte';
  import { ResponsiveTable } from '$components';
  import Menu from './Menu.svelte';

  // handlers
  const rowSelectChangeHandler = (e) => {
    rows = rows.map((row) => {
      row.dtSelect = e.target.checked;
      return row;
    });
  };

  // utilities
  const updateRowSelectCheckbox = (checked: boolean | string) => {
    columns = columns.map((column) => {
      if (column.key === 'dtSelect') column.checked = checked;
      return column;
    });
  };

  // props (external)
  export let columns: {
    changeHandler?: Function;
    checked?: boolean | string;
    classes?: string;
    editable?: boolean;
    key: string;
    th: string;
    type?: string;
  }[] = [];
  export let isAddable = true;
  export let isDeleteable = true;
  export let isEditable = true;
  export let isExportable = true;
  export let rows: { [key: string]: any }[] = [];
  export let sort: { key: string; direction: number } | undefined = undefined;
  export let sortHandler;

  // props (dynamic)
  $: if ([...rows].filter((row) => row?.dtSelect).length === 0) updateRowSelectCheckbox(false);
  $: if ([...rows].filter((row) => row?.dtSelect).length === rows.length)
    updateRowSelectCheckbox(true);
  $: if (
    [...rows].filter((row) => row?.dtSelect).length > 0 &&
    [...rows].filter((row) => row?.dtSelect).length < rows.length
  )
    updateRowSelectCheckbox('indeterminate');

  // lifecycle
  onMount(() => {
    if (isDeleteable && [...columns].filter((column) => column.key === 'dtSelect').length === 0) {
      columns = [
        {
          changeHandler: rowSelectChangeHandler,
          classes: 'w-[1.75rem]',
          key: 'dtSelect',
          th: '',
          type: 'checkbox'
        },
        ...columns.map((column) => {
          if (isEditable) column = { type: 'input', ...column };
          return column;
        })
      ];
      rows = rows.map((row) => {
        return { dtSelect: false, ...row };
      });
    }
  });
</script>

<Menu bind:rows {isAddable} {isDeleteable} {isExportable} />
<ResponsiveTable {...$$restProps} bind:columns bind:rows bind:sort bind:sortHandler />
