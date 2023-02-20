<script lang="ts">
  import { page } from '$app/stores';
  import { RouteTitle } from '$components';
  import type { LayoutData } from './$types';

  // props (external)
  export let data: LayoutData;

  // props (dynamic)
  $: flatNavigation = Object.keys(data.user.navigation)
    .map((key) => data.user.navigation[key])
    .flat();
  $: currentRoute = flatNavigation.find((item) => item.route === $page.url.pathname) || {
    title: ''
  };
</script>

<RouteTitle>
  {#if currentRoute?.group !== '' && currentRoute?.group !== undefined}
    {currentRoute.group} -
  {/if}
  {currentRoute.name}
</RouteTitle>
<slot {data} />
