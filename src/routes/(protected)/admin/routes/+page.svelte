<script lang="ts">
  import { onMount } from 'svelte';
  import { MongoTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  let columns = [
    { classes: 'w-[5rem]', key: 'group', th: 'Group' },
    { classes: 'w-[5rem]', key: 'name', th: 'Name' },
    { classes: 'w-[5rem]', key: 'route', th: 'Route' }
  ];
  let rows: {
    group: string;
    name: string;
    route: string;
  }[] = [];

  // props (external)
  export let data: PageData;

  onMount(() => {
    rows = data.routes;
  });
</script>

<div class="flex flex-col flex-grow overflow-auto p-[1px]">
  <MongoTable bind:columns bind:rows collection="routes" />
</div>
