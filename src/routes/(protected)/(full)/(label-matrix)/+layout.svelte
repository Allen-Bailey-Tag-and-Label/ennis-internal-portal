<script lang="ts">
  import Header from './Header.svelte';
  import type { LayoutData } from './$types';
  import New from './modals/New/Modal.svelte';

  // props (external)
  export let data: LayoutData;
</script>

<div class="flex flex-col flex-grow">
  <div class="flex flex-col flex-grow items-center justify-center p-[1rem] lg:hidden">
    <div>This is not available on mobile devices. Please use a desktop.</div>
  </div>
  <div class="hidden flex-col flex-grow lg:flex">
    <Header />
    <slot {data} />
  </div>
</div>

<New />
