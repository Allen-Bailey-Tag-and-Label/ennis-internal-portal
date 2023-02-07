<script lang="ts">
  import type { PageData } from './$types';

  // props (external)
  export let data: PageData;
</script>

<div class="flex flex-col flex-grow overflow-auto">
  <div>Dashboard</div>
  <div>Welcome {data.user.firstName} {data.user.lastName}!</div>
</div>
