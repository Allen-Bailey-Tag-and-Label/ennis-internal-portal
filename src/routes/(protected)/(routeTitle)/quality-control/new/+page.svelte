<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Input, MultiStepForm } from '$components';
  import { InformationCircle, QuestionMarkCircle, User } from '$icons';
  import StepEmployeeAssignment from './steps/EmployeeAssigment.svelte';
  import StepInfo from './steps/Info.svelte';
  import StepReason from './steps/Reason.svelte';

  // props (internal)
  let currentStep: number = 0;
  let orderNumber = '8345172';
  let steps = [
    {
      component: StepInfo,
      iconSrc: InformationCircle,
      subtitle: 'Review Order',
      title: 'Information'
    },
    {
      component: StepEmployeeAssignment,
      iconSrc: User,
      subtitle: 'Assign the employee(s) responsible',
      title: 'Employee'
    },
    {
      component: StepReason,
      iconSrc: QuestionMarkCircle,
      subtitle: 'Log the reason code',
      title: 'Reason'
    }
  ];

  // props (external)
  export let form: undefined | { data: { docs: {}[]; orderNumber: number | string } };
</script>

<div class="flex flex-col flex-grow overflow-auto space-y-[2rem] p-[1rem] m-[-1rem] max-w-[100vw]">
  <Form
    action="?/find-order"
    class="max-w-none flex-row space-y-0 items-end space-x-[1rem] lg:self-start lg:w-auto"
    use={[enhance]}
  >
    <Fieldset class="w-auto flex-grow" legend="SA #">
      <Input
        bind:value={orderNumber}
        class="w-full"
        name="orderNumber"
        required={true}
        type="number"
      />
    </Fieldset>
    <Button type="submit">Lookup</Button>
  </Form>
  {#if form?.data}
    {#if form.data.docs.length === 0}
      <div>Could not find SA #{form.data.orderNumber}</div>
    {/if}
    {#if form.data.docs.length > 0}
      <MultiStepForm action="?/submit" bind:currentStep bind:data={form.data} {steps} />
    {/if}
  {/if}
</div>
