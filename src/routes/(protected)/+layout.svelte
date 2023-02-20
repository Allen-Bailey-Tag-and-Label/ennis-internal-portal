<script lang="ts">
  import { page } from '$app/stores';
  import { Button, Form, Icon, Header, Main, Nav, Overlay, RouteTitle } from '$components';
  import { MenuAlt4, X } from '$icons';
  import type { LayoutData } from './$types';

  // handlers
  const showNav = () => (isNavOpen = true);
  const toggleNav = () => (isNavOpen = !isNavOpen);

  // props (internal)
  let layoutWidth = 0;
  let navWidth = 0;
  let isNavOpen = false;

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

<div
  bind:clientWidth={layoutWidth}
  class="flex flex-col-reverse flex-grow overflow-hidden lg:flex-row"
>
  <Header>
    <Button
      class="px-[.5rem] bg-transparent hover:bg-primary-600 focus:bg-primary-600 focus:ring-primary-600/[.3] z-[3]"
      on:click={toggleNav}
    >
      <Icon src={!isNavOpen ? MenuAlt4 : X} />
    </Button>
    <Overlay
      class={!isNavOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
      on:click={toggleNav}
    />
    <Nav
      class={!isNavOpen
        ? 'translate-x-full shadow-none dark:shadow-none lg:-translate-x-full'
        : 'translate-x-0'}
    >
      <div bind:clientWidth={navWidth} class="flex flex-col space-y-[2rem]">
        {#each Object.keys(data.user.navigation) as group}
          <div class="flex flex-col">
            {#if group !== ''}
              <div class="text-[1.5rem] font-semibold px-[1rem]">{group}</div>
            {/if}
            {#each data.user.navigation[group] as { name, route }}
              <a
                class="px-[1rem] py-[.5rem] lg:min-w-[375px] outline-none transition duration-200 ring ring-transparent hover:bg-primary-600 focus:bg-primary-600 focus:ring-primary-600/[.3]"
                href={route}
                on:click={toggleNav}
                on:focus={showNav}
              >
                {name}
              </a>
            {/each}
          </div>
        {/each}
      </div>
      <Form action="/sign-out">
        <Button class="justify-start px-[1rem] py-[.5rem]" on:focus={showNav} type="submit"
          >Sign Out</Button
        >
      </Form>
    </Nav>
  </Header>
  <Main
    style="transform: translateX({!isNavOpen
      ? 0
      : layoutWidth < 1024
      ? -navWidth
      : navWidth - 40}px)"
  >
    <RouteTitle>
      {#if currentRoute?.group !== '' && currentRoute?.group !== undefined}
        {currentRoute.group} -
      {/if}
      {currentRoute.name}
    </RouteTitle>
    <slot {data} />
  </Main>
</div>
