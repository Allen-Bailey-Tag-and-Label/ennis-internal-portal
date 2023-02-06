<script lang="ts">
    import {theme} from 'sveltewind/stores';
    import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Input } from '$components';
  import RouteTitle from '../RouteTitle.svelte'

  // types
  type Form = {
    success?: boolean
  }
  type Step = {
    fields: {
      changeHandler?: Function;
      legend: string;
      name: string;
      required?: boolean;
      type?: string;
      value: string;
    }[];
    text: string;
  }[];

  // handlers
  const updateUsername = () => {
    // find login step index
    const index = steps.findIndex((step) => step.text === 'Login Information');

    // get username
    const username = (steps[0].fields[0].value.charAt(0) + steps[0].fields[1].value).toLowerCase();

    // update username
    steps[index].fields[0].value = username;
  };

  // props (internal)
  let step = 0;
  const steps: Step = [
    {
      fields: [
        {
          changeHandler: updateUsername,
          legend: 'First Name',
          name: 'firstName',
          required: true,
          value: ''
        },
        {
          changeHandler: updateUsername,
          legend: 'Last Name',
          name: 'lastName',
          required: true,
          value: ''
        }
      ],
      text: 'Personal Information'
    },
    {
      fields: [
        { legend: 'Ennis ID', name: 'ennisId', type: 'number', required: true, value: '' },
        { legend: 'Hire Date', name: 'hiredAt', type: 'date', required: true, value: '' },
        { legend: 'Title', name: 'title', value: '' }
      ],
      text: 'Ennis Information'
    },
    {
      fields: [
        { legend: 'Email', name: 'email', type: 'email', value: '' },
        { legend: 'Phone Extension', name: 'phoneExtension', type: 'number', value: '' }
      ],
      text: 'Contact Information'
    },
    {
      fields: [
        { legend: 'Username', name: 'username', required: true, value: '' },
        {
          legend: 'Password',
          name: 'password',
          type: 'password',
          required: true,
          value: 'ABTL1234$'
        }
      ],
      text: 'Login Information'
    }
  ];

  // props (external)
  export let form: Form;
</script>

  <RouteTitle>Initialize DB</RouteTitle>
    {#if !form?.success}
    <Form class="w-full space-y-[2rem] flex-grow overflow-hidden" use={[enhance]}>
        <div class="flex flex-col flex-grow overflow-auto p-[1px]">
      {#each steps as { fields, text }, i}
          <div class="flex flex-col space-y-[1rem] {i === step ? '' : 'opacity-0 pointer-events-none absolute'}">
            <div class="opacity-50">{text}</div>
            {#each fields as { changeHandler = () => {}, legend, name, required = undefined, type = undefined, value }}
              <Fieldset {legend}>
                <Input bind:value {name} on:change={changeHandler} {required} {type} />
              </Fieldset>
            {/each}
          </div>
      {/each}
        </div>
        <div class="grid grid-cols-2 gap-[1rem]">
        {#if step === 0}
          <div />
        {:else}
          <Button on:click={() => (step = step - 1)}>Back</Button>
        {/if}
        {#if steps[step]?.fields?.filter((field) => field?.required === true)?.length <= steps[step]?.fields?.filter((field) => field.value !== '')?.length}
        {#if step < steps.length -1}
          <Button
            on:click={() => (step = step + 1)}
          >
              Next
          </Button>
          {:else}
          <Button
            type="submit"
          >
              Submit
          </Button>
          {/if}
        {:else}
          <div />
        {/if}
      </div>
    </Form>
    {:else}
        <div class="w-full space-y-[2rem] flex flex-col flex-grow overflow-auto lg:flex-grow-0">
            <div class="text-green-500 flex flex-grow">Successfully initiated the db.</div>
            <a class={$theme.button} href="/sign-in">Sign In</a>
        </div>
    {/if}
