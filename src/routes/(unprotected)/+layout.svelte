<script lang="ts">
  // props (external)
  export let title = '';
</script>

<div
  class="flex flex-grow flex-col overflow-hidden items-center justify-center p-[1rem] min-h-full"
>
  <div
    class="max-w-[375px] w-full flex flex-col flex-grow px-[1px] space-y-[2rem] overflow-hidden lg:flex-grow-0"
  >
    <slot />
  </div>
</div>
