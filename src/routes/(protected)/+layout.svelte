<script lang="ts">
  import { Button, Form, Icon, Header, Main, Nav, Overlay } from '$components';
  import { MenuAlt4, X } from '$icons';
  import type { LayoutData } from './$types';

  // handlers
  const showNav = () => (isNavOpen = true);
  const toggleNav = () => (isNavOpen = !isNavOpen);

  // props (internal)
  let isNavOpen = true;

  // props (external)
  export let data: LayoutData;
</script>

<div class="flex flex-col flex-grow overflow-hidden lg:flex-row-reverse">
  <Main>
    <slot {data} />
  </Main>
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
      <div class="flex flex-col space-y-[2rem]">
        {#each Object.keys(data.user.navigation) as group}
          <div class="flex flex-col">
            {#if group !== ''}
              <div class="text-[1.5rem] font-semibold px-[1rem]">{group}</div>
            {/if}
            {#each data.user.navigation[group] as { name, route }}
              <a
                class="px-[1rem] py-[.5rem] lg:min-w-[375px] outline-none transition duration-200 ring ring-transparent hover:bg-primary-600 focus:bg-primary-600 focus:ring-primary-600/[.3]"
                href={route}
                on:focus={showNav}
              >
                {name}
              </a>
            {/each}
          </div>
        {/each}
      </div>
      <Form action="/sign-out">
        <Button class="justify-start px-[1rem] py-[.5rem]" type="submit">Sign Out</Button>
      </Form>
    </Nav>
  </Header>
</div>
