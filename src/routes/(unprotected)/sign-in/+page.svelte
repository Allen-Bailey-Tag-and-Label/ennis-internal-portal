<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Input, PasswordInput, RouteTitle } from '$components';

  // types
  type Form = {
    error?: string;
    succes?: boolean;
  };

  // props (internal)
  const fields = [
    {
      changeHandler: () => (fields[0].value = fields[0].value.toLowerCase().trim()),
      component: Input,
      legend: 'Username',
      name: 'username',
      required: true,
      value: ''
    },
    {
      component: PasswordInput,
      legend: 'Password',
      name: 'password',
      required: true,
      type: 'password',
      value: ''
    }
  ];

  // props (external)
  export let form: Form;
</script>

<RouteTitle>Sign In</RouteTitle>
<Form class="w-full space-y-[1rem] justify-center overflow-hidden" use={[enhance]}>
  <div class="text-red-500 min-h-[1.5rem]">
    {#if form?.error}
      {form.error}
    {/if}
  </div>
  <div class="flex flex-col overflow-auto space-y-[1rem] p-[1px]">
    {#each fields as { changeHandler = undefined, component, legend, name, required = undefined, type = undefined, value }}
      <Fieldset {legend}>
        <svelte:component
          this={component}
          bind:value
          {name}
          on:change={changeHandler}
          {required}
          {type}
        />
      </Fieldset>
    {/each}
  </div>
  <Button type="submit">Sign In</Button>
</Form>
