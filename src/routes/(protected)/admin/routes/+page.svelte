<script lang="ts">
  import { onMount } from 'svelte';
  import { DataTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  let columns = [
    { classes: 'w-[5rem]', key: 'group', th: 'Group' },
    { classes: 'w-[5rem]', key: 'name', th: 'Name' },
    { classes: 'w-[5rem]', key: 'route', th: 'Route' }
  ];
  let rows: Rows = [];

  // props (external)
  export let data: PageData;

  type Route = {
    group: string;
    name: string;
    route: string;
  };
  type Rows = Route[];

  onMount(() => {
    rows = data.routes.sort((a: Route, b: Route) =>
      a.group < b.group
        ? -1
        : a.group > b.group
        ? 1
        : a.name < b.name
        ? -1
        : a.name > b.name
        ? 1
        : 0
    );
  });
</script>

<div class="flex flex-col flex-grow overflow-auto p-[1px]">
  <DataTable bind:columns bind:rows />
</div>
