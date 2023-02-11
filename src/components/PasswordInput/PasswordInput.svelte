<script>
  import { current_component } from 'svelte/internal';
  import { Button, Icon, Input } from 'sveltewind/components';
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { getEvents, setType, use as useAction } from '$actions';
  import { Eye, EyeOff } from '$icons';

  // handlers
  const toggleType = () => {
    type = type === 'password' ? 'text' : 'password';
    elem.type = type;
  };

  // props (internal)
  const events = getEvents(current_component);
  let elem;

  // props (external)
  export let type = 'password';
  export let use = [];
</script>

<div class="relative flex">
  <input
    {...$$restProps}
    bind:this={elem}
    class={twMerge($theme.input, 'pr-[3rem] w-full', $$props.class)}
    use:useAction={[events, [setType, type], ...use]}
  />
  <Button
    class="absolute top-1/2 right-[0rem] -translate-y-1/2 px-[.5rem] bg-transparent hover:bg-black/[.1] focus:bg-black/[.1] focus:ring-black/[.3] dark:bg-transparent dark:hover:bg-white/[.1] dark:focus:bg-white/[.1] dark:focus:ring-white/[.3]"
    on:click={toggleType}
    tabindex="-1"
  >
    <Icon src={type === 'password' ? Eye : EyeOff} />
  </Button>
</div>
