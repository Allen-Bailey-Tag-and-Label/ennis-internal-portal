<script lang="ts">
	import { theme } from 'sveltewind/stores';
	import '../app.postcss';

	theme.set({
		button: 'bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 focus:ring-primary-500/30',
		input:
			'peer bg-white/50 hover:ring-offset-primary-500 focus:ring-offset-primary-500 focus:ring-primary-500/30 dark:bg-black/20 placeholder-transparent',
		legend:
			'opacity-50 peer-focus:opacity-50 peer-placeholder-shown:opacity-100 absolute origin-left top-0 left-0 transition duration-200 translate-y-[-.5rem] scale-[.875] translate-x-0 pointer-events-none peer-focus:translate-y-[-.5rem] peer-focus:scale-[.875] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-[1.5rem] peer-placeholder-shown:translate-x-[1.5rem] peer-focus:translate-x-0',
		fieldset: 'relative space-y-0 pt-[1rem]'
	});
</script>

<slot />
