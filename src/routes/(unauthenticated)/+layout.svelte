<script lang="ts">
	import { Card } from '$components';
</script>

<div class="flex items-stretch h-[100dvh]">
	<div
		class="hidden bg-gradient-to-tr from-primary-500 to-secondary-500 lg:block lg:w-[50%] xl:w-[40%]"
	/>
	<div class="flex items-center justify-center flex-grow p-[1rem]">
		<slot />
	</div>
</div>
