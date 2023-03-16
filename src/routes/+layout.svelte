<script>
  import { theme } from 'sveltewind/stores';
  import { twMerge } from 'tailwind-merge';
  import { page } from '$app/stores';
  import { Pwa } from '$components';
  import '../app.postcss';

  // common classes
  const cardShadow = 'shadow dark:shadow-[0_.5rem_1rem_rgba(0,0,0,.5)]';
  const input =
    'bg-transparent dark:bg-transparent hover:ring-offset-primary-500 focus:ring-offset-primary-500 focus:ring-primary-500/[.3]';

  theme.set({
    button:
      'cursor-pointer bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 focus:ring-primary-600/[.3] disabled:cursor-default disabled:opacity-50 first-letter:disabled:hover:bg-transparent disabled:focus:bg-transparent',
    card: `${cardShadow} dark:bg-gray-800`,
    checkbox: twMerge(
      input,
      'mr-[1rem] px-0 py-0 w-[1.75rem] h-[1.75rem] text-white flex items-center justify-center peer-focus:ring-offset-primary-500 peer-focus:ring-primary-500/[.3]'
    ),
    form: 'max-w-[375px] w-full',
    h1: 'font-semibold text-[2.5rem]',
    h2: 'font-semibold text-[2rem]',
    header: 'bg-primary-500 text-white',
    input: `${input}`,
    main: 'transition duration-200 flex relative flex-grow overflow-hidden pt-0 pl-[max(1rem,_env(safe-area-inset-left))] pr-[max(1rem,_env(safe-area-inset-right))] pb-[1rem] lg:flex-col',
    modal: 'z-[3] isolate',
    nav: `${cardShadow} space-y-[2rem] justify-between transition duration-200 fixed top-0 right-0 w-[calc(100%_-_4rem)] min-h-screen max-h-screen bg-primary-500 z-[2] pt-[max(1rem,_env(safe-area-inset-top))] pb-[max(1rem,_env(safe-area-inset-bottom))] lg:right-auto lg:left-0 lg:w-[auto] lg:pt-[3.5rem]`,
    option:
      'bg-white dark:bg-gray-800 transition duration-200 hover:bg-primary-500 focus:bg-primary-500',
    overlay: 'h-screen z-[2] transition duration-200 cursor-pointer',
    select: twMerge(input),
    table: 'bg-transparent dark:bg-transparent',
    td: 'outline-none ring-1 ring-transparent focus:ring-primary-500',
    textarea: `${input}`,
    th: 'z-[1] sticky top-0 transition duration-200 bg-primary-500 hover:bg-primary-600 text-white border-b-0 shadow-[inset_0_-1px_0_rgba(255,255,255,.3)] cursor-pointer',
    tr: 'transition duration-200 odd:bg-black/[.05] dark:odd:bg-white/[.05] hover:bg-primary-500/[.15] odd:hover:bg-primary-500/[.1] dark:hover:bg-primary-500/[.1] dark:odd:hover:bg-primary-500/[.15]'
  });
  $: title = [
    ...$page.url.pathname
      .substring(1)
      .split('/')
      .map((directory) => {
        const words = directory
          .split('-')
          .map((word) =>
            word.length === 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
          );
        return words.join(' ');
      }),
    'ABES',
    'Allen Baily Tag & Label'
  ].join(' - ');
</script>

<Pwa>
  <link rel="icon" type="image/svg+xml" href="/favicon/icon.svg" />
  <link rel="alternate icon" href="/favicon/icon-16x16.png" />
  <link rel="apple-touch-icon" href="/favicon/icon-apple-touch.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
  />
  <meta name="theme-color" content="#FFF" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</Pwa>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<slot />
