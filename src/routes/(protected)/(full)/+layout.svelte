<script lang="ts">
  import type { LayoutData } from './$types';

  // props (external)
  export let data: LayoutData;
</script>

<div class="flex flex-col flex-grow mx-[-1rem] mb-[-1rem]">
  <slot {data} />
</div>
