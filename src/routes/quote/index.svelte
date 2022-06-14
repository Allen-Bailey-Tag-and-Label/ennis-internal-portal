<script>
  // imports
  import { goto } from '$app/navigation';
  import { stateOptions } from '@lib/stateAbbreviations';
  import { theme } from 'sveltewind/stores';
  import { onMount } from 'svelte';
  import zipcodes from 'zipcodes';

  // components
  import {
    A,
    Fieldset,
    Form,
    Input,
    Main,
    SafeArea,
    Select,
    SubmitButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
  } from '@components';

  // handlers
  const submitHandler = async (e) => {
    e.preventDefault();
    await findQuotes();
  };
  const zipChangeHandler = () => {
    const result = zipcodes.lookup(shipTo.PostalCode);
    if (result !== undefined) {
      shipTo.City = result.city;
      shipTo.StateProvinceCode = result.state;
    }
  };

  // helpers
  const findQuotes = async () => {
    const response = await fetch('/api/findQuote', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classification,
        dateFrom,
        dateTo,
        quote,
        shipTo
      })
    });
    results = await response.json();
  };

  // props (internal)
  let classification = '';
  const classificationOptions = [
    { label: '', value: '' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Residential', value: 'Residential' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  let dateFrom = '';
  let dateTo = '';
  let results = [];
  let quote = '';
  let shipTo = {
    AddressLine: '',
    City: '',
    StateProvinceCode: '',
    PostalCode: ''
  };

  // lifecycle
  onMount(async () => await findQuotes());
</script>

<Main>
  <SafeArea class="overflow-y-auto">
    <div class="flex flex-col space-y-[2rem] flex-grow container mx-auto py-[2rem]">
      <Form class="flex-row space-y-0 items-end space-x-[1rem]" on:submit={submitHandler}>
        <Fieldset legend="Quote #">
          <Input bind:value={quote} class="pr-[.5rem] text-right w-[7rem]" type="number" />
        </Fieldset>
        <Fieldset legend="From">
          <Input bind:value={dateFrom} class="text-right w-[10.25rem]" type="date" />
        </Fieldset>
        <Fieldset legend="To">
          <Input bind:value={dateTo} class="text-right w-[10.25rem]" type="date" />
        </Fieldset>
        <Fieldset legend="Address">
          <Input bind:value={shipTo.AddressLine} />
        </Fieldset>
        <Fieldset legend="ZIP"
          ><Input
            bind:value={shipTo.PostalCode}
            class="pr-[.5rem] text-right w-[6rem]"
            on:change={() => zipChangeHandler('shipper')}
            type="number"
          /></Fieldset
        >
        <Fieldset legend="City">
          <Input bind:value={shipTo.City} />
        </Fieldset>
        <Fieldset legend="State"
          ><Select options={stateOptions} bind:value={shipTo.StateProvinceCode} /></Fieldset
        >
        <Fieldset legend="Classification"
          ><Select options={classificationOptions} bind:value={classification} /></Fieldset
        >
        <SubmitButton>Find</SubmitButton>
      </Form>
      <Table>
        <Thead>
          <Th class="text-right">Quote #</Th>
          <Th class="text-right">Date</Th>
          <Th>Address</Th>
          <Th class="text-right">ZIP</Th>
          <Th>City</Th>
          <Th>State</Th>
          <Th>Classification</Th>
          <Th />
        </Thead>
        <Tbody>
          {#each results as result}
            <Tr>
              <Td class="text-right">{result.quote}</Td>
              <Td class="text-right"
                >{new Date(result.date).toLocaleDateString()}
                {new Date(result.date).toLocaleTimeString()}</Td
              >
              <Td>{result.shipTo.AddressLine}</Td>
              <Td class="text-right">{result.shipTo.PostalCode}</Td>
              <Td>{result.shipTo.City}</Td>
              <Td>{result.shipTo.StateProvinceCode}</Td>
              <Td>{result.classification}</Td>
              <Td class="text-center"
                ><A
                  class="{$theme.aButton} before:hidden inline-block"
                  href={`/quote/${result.quote}`}>View</A
                ></Td
              >
            </Tr>
          {/each}
        </Tbody>
      </Table>
    </div>
  </SafeArea>
</Main>
