<script lang="ts">
	import { Fieldset, Legend } from 'sveltewind/components';

	// props (external)
	export let legend = undefined;
</script>

<Fieldset>
	<slot />
	<slot name="legend">
		{#if legend}
			<Legend>{legend}</Legend>
		{/if}
	</slot>
</Fieldset>
