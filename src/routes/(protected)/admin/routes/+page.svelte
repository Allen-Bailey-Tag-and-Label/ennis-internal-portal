<script lang="ts">
  import { onMount } from 'svelte';
  import { ResponsiveTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  const columns = [
    { key: 'group', th: 'Group' },
    { key: 'name', th: 'Name' },
    { key: 'route', th: 'Route' }
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

<div class="flex flex-col flex-grow overflow-auto">
  <ResponsiveTable {columns} {rows} />
</div>
