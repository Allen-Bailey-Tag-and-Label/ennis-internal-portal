<script lang="ts">
  import { onMount } from 'svelte';
  import { MongoTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  let columns = [
    { key: 'code', th: 'Code' },
    { key: 'description', th: 'Description' }
  ];
  let rows: {
    code: string;
    description: string;
  }[] = [];

  // props (external)
  export let data: PageData;

  onMount(() => {
    rows = data.qcReasons;
  });
</script>

<div class="flex flex-col flex-grow overflow-auto p-[1px]">
  <MongoTable bind:columns bind:rows collection="quality-control-reasons" />
</div>
