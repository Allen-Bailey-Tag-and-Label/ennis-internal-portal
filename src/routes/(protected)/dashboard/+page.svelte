<script lang="ts">
  import type { PageData } from './$types';

  // props (external)
  export let data: PageData;
</script>

<div
  class="flex flex-col flex-grow overflow-auto p-[1rem] pt-[max(1rem,_env(safe-area-inset-top))]"
>
  <div>Dashboard</div>
  <div>Welcome {data.user.firstName} {data.user.lastName}!</div>
</div>
