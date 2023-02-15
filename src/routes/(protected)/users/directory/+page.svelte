<script lang="ts">
  import { onMount } from 'svelte';
  import { DataTable } from '$components';

  // props (internal)
  let columns = [
    { key: 'firstName', th: 'First' },
    { key: 'lastName', th: 'Last' },
    { key: 'email', th: 'Email' },
    { key: 'extension', th: 'Extension' }
  ];
  let isAddable = false;
  let isDeleteable = false;
  let isEditable = false;
  let rows: {}[] = [];

  // props (external)
  export let data;

  // lifecycle
  onMount(() => {
    rows = data.users.filter(({ isActive }) => isActive);
  });
</script>

<div class="flex flex-col flex-grow overflow-hidden">
  <DataTable bind:columns bind:rows bind:isAddable bind:isDeleteable bind:isEditable />
</div>
