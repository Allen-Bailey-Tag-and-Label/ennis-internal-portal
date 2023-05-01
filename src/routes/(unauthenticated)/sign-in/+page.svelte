<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Fieldset, Form, H1, Input } from '$components';
</script>

<Form class="w-full max-w-[375px]" use={[enhance]}>
	<H1 class="text-center mb-[2rem]">Welcome</H1>
	<Fieldset legend="Username">
		<Input name="username" placeholder="Username" />
	</Fieldset>
	<Fieldset legend="Password">
		<Input name="password" type="password" placeholder="Password" />
	</Fieldset>
	<a
		class="self-end opacity-50 text-[.875rem] hover:text-primary-500 hover:opacity-100 focus:opacity-100 transition duration-200 outline-none focus:text-primary-500"
		href="/request-password-reset">Forgot password?</a
	>
	<Button type="submit">Sign In</Button>
</Form>
