<script>
	// imports
	import { A, Header, Nav, Title } from '@components';
	import { page } from '$app/stores';
	import { quotes, theme } from '@stores';
	import { onMount } from 'svelte';
	import '../app.css';

	// helpers
	const findQuotes = async () => {
		const response = await fetch('/api/findQuote');
		$quotes = await response.json();
	};

	// props (internal)
	const nav = [
		{ href: '/multiple-addresses', text: 'Multiple Addresses' },
		{ href: '/new', text: 'New' },
		{ href: '/quote', text: 'Quote Finder' }
	];

	theme.set({
		a: 'shadow-none',
		aButton: $theme.button,
		button: 'disabled:bg-gray-500',
		buttonIcon: 'px-[.5rem]',
		option: 'dark:bg-gray-900',
		table: 'print:shadow-none',
		td: 'print:px-0',
		th: 'dark:bg-white/[.025] border-0',
		tr: 'print:border-b-0'
	});

	// lifecycle
	onMount(async () => await findQuotes());
</script>

<Title base="Employee Internal Portal - Allen Bailey Tag & Label" />

<Header class="print:hidden">
	<Nav class="container flex-row mx-auto overflow-y-visible">
		<div class="flex ml-[-1.5rem]">
			{#each nav as { href, text }}
				<A
					class="transition duration-200 before:hidden hover:before:hidden px-[1.5rem] py-[.75rem] border-b {$page
						.url.pathname !== href
						? 'border-transparent hover:text-blue-500'
						: 'border-blue-500 cursor-default hover:text-gray-900 dark:hover:text-white'}"
					{href}>{text}</A
				>
			{/each}
		</div>
	</Nav>
</Header>
<slot />
