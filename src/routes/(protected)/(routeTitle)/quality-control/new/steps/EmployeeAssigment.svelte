<script lang="ts">
  import { Button, Card, Fieldset, Input, Select } from '$components';

  // props (external)
  export let currentStep: number;
  export let data;
  export let i: number;

  // props (dynamic)
  $: _userOptions = data.users
    .map(({ _id, firstName, lastName }) => {
      return { label: `${firstName} ${lastName}`, value: _id };
    })
    .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
</script>

<Card class={currentStep !== i ? 'hidden' : ''}>
  <div class="inline-grid gap-x-[1rem] gap-y-[1rem] grid-cols-[fit-content(0px)_1fr]">
    {#each data._users as { _id }, j}
      <Fieldset legend="Employee">
        <Select bind:value={_id} name="users" options={_userOptions} required="true" />
      </Fieldset>
      <!-- <Fieldset legend="Percent">
        <Input bind:value={percent} name="percent" type="number" />
      </Fieldset> -->
      <div class="flex justify-end items-end">
        {#if j === 0}
          <Button on:click={() => (data._users = [...data._users, { _id: '' }])}
            >Add Employee</Button
          >
        {:else}
          <Button on:click={() => (data._users = data._users.filter((_, index) => j !== index))}
            >Remove Employee</Button
          >
        {/if}
      </div>
    {/each}
  </div>
</Card>
