<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Input, PasswordInput } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  let currentPassword = '';
  let password = '';
  let confirmPassword = '';

  // props (external)
  export let data: PageData;
  export let form: { error: string | undefined; success: boolean | undefined };
</script>

<div class="min-h-[1.5rem]">
  {#if form?.error}
    <div class="text-red-500">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="text-green-500">Successfully updated password</div>
  {/if}
</div>
<Form class="overflow-auto px-[1px]" use={[enhance]}>
  <Input name="username" type="hidden" value={data.user.username} />
  <Fieldset legend="Current Password">
    <PasswordInput bind:value={currentPassword} name="currentPassword" required="true" />
  </Fieldset>
  <Fieldset legend="Password">
    <PasswordInput bind:value={password} name="password" required="true" />
  </Fieldset>
  <Fieldset legend="Confirm Password">
    <PasswordInput bind:value={confirmPassword} name="confirmPassword" required="true" />
  </Fieldset>
  <Button type="submit">Change Password</Button>
</Form>
