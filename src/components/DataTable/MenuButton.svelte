<script lang="ts">
  import { current_component } from 'svelte/internal';
  import { getEvents } from '$actions';
  import { Button, Icon } from '$components';

  // props (internal)
  const events = getEvents(current_component);

  // props (external)
  export let isMenuOpen = false;
  export let src;
  export let use = [];
</script>

<Button
  {...$$restProps}
  class="grid grid-cols-[fit-content(10px)_1fr] gap-[1rem]"
  tabindex={!isMenuOpen ? '-1' : undefined}
  use={[events, ...use]}
>
  <Icon {src} />
  <div class="whitespace-nowrap text-left"><slot /></div>
</Button>
