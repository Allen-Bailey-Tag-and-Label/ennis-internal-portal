<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { clickOutside } from '$actions';
  import { Button, Card, Icon } from '$components';
  import { ChevronDown, X } from '$icons';
  import { grow } from '$transitions';

  // handlers
  const clearValues = () => {
    // clear value
    value = [];

    // dispatch change event
    dispatch('change', value);
  };
  const closeMenu = () => (menuIsOpen = false);
  const optionClickHandler = (option) => {
    // initiate exists variable
    let exists = false;

    // check if option.value is in value
    if (value.includes(option.value)) exists = true;

    // if option.value exists, remove from value
    if (exists) value = value.filter((v) => v !== option.value);

    // if option.value does not exist, add to value
    if (!exists) value = [...value, option.value];

    // dispatch change event
    dispatch('change', value);
  };
  const removeValue = (i) => {
    value = value.filter((_, index) => i !== index);

    // dispatch change event
    dispatch('change', value);
  };
  const toggleMenu = () => (menuIsOpen = !menuIsOpen);

  // props (internal)
  const dispatch = createEventDispatcher();

  // props (external)
  export let options: { label: string; value: boolean | int | string }[] = [];
  export let menuIsOpen: boolean = false;
  export let value = [];

  // props (dynamic)
  $: containerClasses = twMerge(
    $theme.input,
    'flex relative py-[.25rem] px-0 pr-[5rem] w-full max-w-[20rem]',
    $$props.class
  );
</script>

<button class={containerClasses} on:click|self={toggleMenu} use:clickOutside={closeMenu}>
  <div class="flex gap-[.5rem] px-[.5rem] flex-wrap items-center min-h-[2rem]">
    {#each value as v, i}
      <div
        class="dark:bg-white/[.1] rounded-[.25rem] px-[0rem] py-[0rem] pl-[.5rem] flex items-center space-x-[.5rem]"
        transition:grow|local
      >
        <div>{options.find((option) => option.value === v).label}</div>
        <Button class="px-[.25rem] bg-transparent" on:click={() => removeValue(i)}>
          <Icon class="w-[1rem] h-[1rem]" src={X} />
        </Button>
      </div>
    {/each}
  </div>
  <Card
    class="absolute bottom-0 left-0 z-[2] w-full transition duration-200 px-[0] py-[.25rem] {!menuIsOpen
      ? 'opacity-0 pointer-events-none translate-y-[calc(100%_-_.5rem)]'
      : 'opacity-100 pointer-events-auto translate-y-[100%]'}"
  >
    {#each options as option}
      <Button
        class="justify-start rounded-none {!value.includes(option.value)
          ? 'bg-transparent'
          : 'bg-primary-500'}"
        on:click={() => optionClickHandler(option)}
        tabindex={!menuIsOpen ? '-1' : undefined}
      >
        {option.label}
      </Button>
    {/each}
  </Card>
  <Button
    class="absolute top-0 right-[2.5rem] px-[.5rem] bg-transparent"
    on:click={toggleMenu}
    tabindex="-1"
  >
    <Icon
      class="transition duration-200 {!menuIsOpen ? 'rotate-0' : 'rotate-180'}"
      src={ChevronDown}
    />
  </Button>
  <Button
    class="absolute top-0 right-0 px-[.5rem] bg-transparent"
    on:click={clearValues}
    tabindex="-1"
  >
    <Icon src={X} />
  </Button>
</button>
