<script lang="ts">
  import type { PageData } from './$types';

  // props (external)
  export let data: PageData;
</script>

<div class="flex flex-col text-[1.5rem] lg:flex-row lg:space-x-[.5rem]">
  <div>Welcome back</div>
  <div class="font-semibold">{data.user.firstName} {data.user.lastName}!</div>
</div>
