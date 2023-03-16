<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import {
    Button,
    Card,
    Fieldset,
    Form,
    Input,
    ResponsiveTable,
    Select,
    Textarea
  } from '$components';
  import { InformationCircle, User } from '$icons';
  import { currency, twoDigits } from '$lib/format';
  import Buttons from './Buttons.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import StepEmployeeAssignment from './steps/EmployeeAssigment.svelte';
  import StepInfo from './steps/Info.svelte';

  // props (internal)
  let columns = [
    { class: 'text-right', key: 'line-number', th: 'Line #', type: 'string' },
    { key: 'description-1', th: 'Description', type: 'string' },
    { class: 'text-right', key: 'quantity', th: 'Total Quantity', type: 'string' },
    { key: 'uom', th: 'UoM', type: 'string' },
    { class: 'text-right font-mono', key: 'unit-price', th: 'Unit Price', type: 'string' },
    {
      class: 'text-right font-mono',
      key: 'qc-quantity',
      th: 'QC Quantity',
      type: 'int'
    },
    { key: 'toBeReturned', th: 'To Be Returned', type: 'checkbox' },
    { class: 'text-right font-mono', key: 'discountPercent', th: 'Discount %', type: 'int' },
    { class: 'text-right font-mono', key: 'creditAmount', th: 'Credit' }
  ];
  let currentStep = 0;
  let orderNumber = '8345172';
  let reasonOptions: { label: string; value: string }[] = [];
  let rows: {
    'line-number': string;
    'description-1': string;
    quantity: string;
    uom: string;
    'unit-price': string;
    'qc-quantity': string;
    toBeReturned: boolean;
    discountPercent: string;
    creditAmount: string;
  }[] = [];
  let steps = [
    { iconSrc: InformationCircle, subtitle: 'Review Order', title: 'Information' },
    { iconSrc: User, subtitle: 'Assign the member(s) responsible', title: 'Employee' }
  ];
  let userOptions: { label: string; value: string }[] = [];

  // props (external)
  export let data: {
    qcReasons: { _id: string; code: string; description: string }[];
    users: { _id: string; firstName: string; lastName: string }[];
  };
  export let form:
    | {
        _reason: string;
        _userId: string;
        docs: { [key: string]: any }[];
        freight: string;
        initiated: undefined | boolean;
        orderNumber: string;
        'problem-description': string;
      }
    | undefined = undefined;

  // props (dynamic)
  $: if (form?.docs !== undefined && form?.initiated === undefined) {
    form = {
      _reason: '',
      _userId: '',
      freight: '',
      initiated: true,
      'problem-description': '',
      ...form
    };
    rows = [...form.docs]
      .filter((doc) => doc['line-type'] === 'W' || doc['line-type'] === 'S')
      .map((doc) => {
        return {
          'line-number': doc['line-number'],
          'description-1': doc['description-1'],
          quantity: doc.quantity,
          uom: doc.uom,
          'unit-price': currency(doc['unit-price'], {
            options: { currency: 'USD', minimumFractionDigits: 5, style: 'currency' }
          }),
          'qc-quantity': '0',
          toBeReturned: true,
          discountPercent: '100',
          creditAmount: twoDigits(0)
        };
      });
  }
  $: if (rows) {
    rows = rows.map((row) => {
      row.creditAmount = currency(
        ((+row['qc-quantity'] * +row['unit-price'].replace(/[^\d|.]/g, '')) / 1000) *
          (+row.discountPercent / 100)
      );
      return row;
    });
  }
  onMount(() => {
    userOptions = [
      { label: '', value: '' },
      ...data.users.map((user) => {
        return { label: `${user.firstName} ${user.lastName}`, value: user._id };
      })
    ].sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
    reasonOptions = [
      { label: '', value: '' },
      ...data.qcReasons.map((qcReason) => {
        return { label: qcReason.description, value: qcReason._id };
      })
    ].sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  });
</script>

<div class="flex flex-col flex-grow overflow-auto space-y-[1rem] p-[1rem] m-[-1rem] max-w-[100vw]">
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

  {#if form?.orderNumber !== undefined}
    {#if form.docs.length === 0}
      <div>Could not find SA #{form.orderNumber}.</div>
    {:else}
      <div
        class="flex flex-col space-y-[1rem] lg:flex-row lg:space-y-0 lg:space-x-[2rem] flex-grow"
      >
        <ProgressBar bind:currentStep {steps} />
        <div class="flex flex-col space-y-[1rem] flex-grow">
          <StepInfo bind:currentStep bind:form />
          <StepEmployeeAssignment bind:currentStep bind:form />
          <Buttons bind:currentStep />
        </div>
      </div>
      <!-- <Form action="?/submit" class="self-start w-auto max-w-full" use={[enhance]}>
        <div class="flex flex-col space-y-[1rem] lg:items-start">
          <Card class="grid gap-x-[1rem] grid-cols-[fit-content(10px)_1fr] lg:self-start">
            <div class="font-semibold whitespace-nowrap">SA #</div>
            <div>
              {form.orderNumber}
              <Input name="orderNumber" type="hidden" value={form.orderNumber} />
            </div>
            <div class="font-semibold whitespace-nowrap">Customer</div>
            <div>
              {form.docs[0]['sold-to-name']}
              <Input name="sold-to-name" type="hidden" value={form.docs[0]['sold-to-name']} />
            </div>
            <div class="font-semibold whitespace-nowrap">Customer #</div>
            <div>
              {form.docs[0]['sold-to']}
              <Input name="sold-to" type="hidden" value={form.docs[0]['sold-to']} />
            </div>
            <div class="font-semibold whitespace-nowrap">Invoice #</div>
            <div>
              {form.docs[0]['invoice-number']}
              <Input name="invoice-number" type="hidden" value={form.docs[0]['invoice-number']} />
            </div>
          </Card>
          <Card
            class="space-y-[1rem] items-start max-w-full lg:flex-row lg:space-y-0 lg:space-x-[1rem]"
          >
            <Fieldset legend="Employee Responsible">
              <Select
                bind:value={form._userId}
                class="w-full max-w-full"
                name="_userId"
                options={userOptions}
                required="true"
              />
            </Fieldset>
            <Fieldset legend="Reason">
              <Select
                bind:value={form._reason}
                class="w-full max-w-full"
                name="_reason"
                options={reasonOptions}
                required="true"
              />
            </Fieldset>
            <Fieldset legend="Freight Due">
              <Input
                bind:value={form.freight}
                class="w-full max-w-full"
                name="freight"
                required="true"
              />
            </Fieldset>
          </Card>
          <ResponsiveTable
            bind:columns
            bind:rows
            isAddable={false}
            isExportable={false}
            isDeleteable={false}
          />
          <Card
            class="space-y-[1rem] items-start max-w-full lg:flex-row lg:space-y-0 lg:space-x-[1rem] w-full"
          >
            <Fieldset class="flex-grow w-full" legend="Problem / Description">
              <Textarea
                bind:value={form['problem-description']}
                class="flex-grow h-[10rem]"
                name="problem-description"
                required="true"
              />
            </Fieldset>
          </Card>
        </div>
        <Button class="self-end" type="submit">Submit</Button>
      </Form> -->
    {/if}
  {/if}
</div>
