<script lang="ts">
  import { onMount } from 'svelte';
  import navStore from '../../NavStore';

  onMount(() => {
    $navStore.file.menuItems.close.disabled = true;
    $navStore.file.menuItems.delete.disabled = true;
    $navStore.file.menuItems.new.disabled = false;
    $navStore.file.menuItems.open.disabled = false;
    $navStore.file.menuItems.print.disabled = true;
    $navStore.file.menuItems.save.disabled = true;
    $navStore.file.menuItems.saveAs.disabled = true;
  });
</script>
