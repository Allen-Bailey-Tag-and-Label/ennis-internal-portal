<script lang="ts">
  import { onMount } from 'svelte';
  import navStore from '../../../NavStore';

  // props (external)
  export let data;

  onMount(() => {
    $navStore.file.menuItems.close.disabled = false;
    $navStore.file.menuItems.delete.disabled = false;
    $navStore.file.menuItems.print.disabled = false;
    $navStore.file.menuItems.save.disabled = false;
    $navStore.file.menuItems.saveAs.disabled = false;
  });
</script>
