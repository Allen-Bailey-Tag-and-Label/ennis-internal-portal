<script>
  // imports
  import { stateOptions } from '@lib/stateAbbreviations';
  import { pagination, quoteFilter, quotes, theme } from '@stores';
  import { onMount } from 'svelte';
  import zipcodes from 'zipcodes';

  // components
  import {
    A,
    Button,
    Fieldset,
    Input,
    Main,
    SafeArea,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
  } from '@components';

  // handlers
  const zipChangeHandler = () => {
    const result = zipcodes.lookup($quoteFilter.shipTo.PostalCode);
    if (result !== undefined) {
      $quoteFilter.shipTo.City = result.city;
      $quoteFilter.shipTo.StateProvinceCode = result.state;
    }
  };

  // helpers
  const clearFilters = () =>
    ($quoteFilter = {
      classification: '',
      dateFrom: '',
      dateTo: '',
      quote: '',
      shipTo: {
        AddressLine: '',
        City: '',
        StateProvinceCode: '',
        PostalCode: ''
      }
    });
  const findQuotes = async () => {
    const response = await fetch('/api/findQuote');
    $quotes = await response.json();
  };
  const getFilteredResults = (arr) => {
    try {
      // destructure quoteFilter
      const { classification, dateFrom, dateTo, quote, shipTo } = $quoteFilter;

      // check if classification is not empty
      if (classification !== '') arr = arr.filter((elem) => elem.classification === classification);

      // check if quote is not empty
      if (quote !== '') arr = arr.filter((elem) => new RegExp(quote, 'g').test(elem.quote));

      // check if dateFrom is not empty
      if (dateFrom !== '') arr = arr.filter((elem) => new Date(elem.date) >= new Date(dateFrom));

      // check if dateTo is empty
      if (dateTo !== '')
        arr = arr.filter(
          (elem) =>
            new Date(elem.date) <=
            new Date(new Date(dateTo).setDate(new Date(dateTo).getDate() + 1))
        );

      // check if AddressLine is not empty
      if (shipTo.AddressLine !== '')
        arr = arr.filter((elem) =>
          new RegExp(shipTo.AddressLine, 'gi').test(elem.shipTo.AddressLine)
        );

      // check if City is not empty
      if (shipTo.City !== '')
        arr = arr.filter((elem) => new RegExp(shipTo.City, 'gi').test(elem.shipTo.City));

      // check if StateProvinceCode is not empty
      if (shipTo.StateProvinceCode !== '')
        arr = arr.filter((elem) =>
          new RegExp(shipTo.StateProvinceCode, 'gi').test(elem.shipTo.StateProvinceCode)
        );

      // check if PostalCode is not empty
      if (shipTo.PostalCode !== '')
        arr = arr.filter((elem) =>
          new RegExp(shipTo.PostalCode, 'gi').test(elem.shipTo.PostalCode)
        );
    } catch (error) {}

    return arr;
  };

  // props (internal)
  const classificationOptions = [
    { label: '', value: '' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Residential', value: 'Residential' },
    { label: 'Unclassified', value: 'Unclassified' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  let filteredResults = [];
  const resultsOptions = [
    { label: '10 results', value: 10 },
    { label: '25 results', value: 25 },
    { label: '50 results', value: 50 },
    { label: '100 results', value: 100 },
    { label: 'All', value: 'All' }
  ];

  // props (dynamic)
  $: if ($quoteFilter || $quotes) filteredResults = getFilteredResults($quotes);
  $: showingOptions =
    $pagination.number === 'All'
      ? [{ label: `1 - ${filteredResults.length}` }]
      : [...Array(Math.ceil(filteredResults.length / +$pagination.number))].map((_, i) => {
          return {
            label: `${i * $pagination.number + 1} - ${Math.min(
              filteredResults.length,
              (i + 1) * $pagination.number
            )}`,
            value: i
          };
        });
  $: paginatedResults =
    $pagination.number === 'All'
      ? [...filteredResults]
      : [...filteredResults].slice(
          +$pagination.current * +$pagination.number,
          (+$pagination.current + 1) * +$pagination.number - 1
        );

  // lifecycle
  onMount(async () => await findQuotes());
</script>

<Main>
  <SafeArea class="overflow-y-auto">
    <div class="flex flex-col space-y-[2rem] flex-grow container mx-auto py-[2rem]">
      <div class="flex flex-row space-y-0 items-end space-x-[1rem]">
        <Fieldset legend="Quote #">
          <Input
            bind:value={$quoteFilter.quote}
            class="pr-[.5rem] text-right w-[7rem]"
            type="number"
          />
        </Fieldset>
        <Fieldset legend="From">
          <Input bind:value={$quoteFilter.dateFrom} class="text-right w-[10.25rem]" type="date" />
        </Fieldset>
        <Fieldset legend="To">
          <Input bind:value={$quoteFilter.dateTo} class="text-right w-[10.25rem]" type="date" />
        </Fieldset>
        <Fieldset legend="Address">
          <Input bind:value={$quoteFilter.shipTo.AddressLine} />
        </Fieldset>
        <Fieldset legend="ZIP"
          ><Input
            bind:value={$quoteFilter.shipTo.PostalCode}
            class="pr-[.5rem] text-right w-[6rem]"
            on:change={() => zipChangeHandler('shipper')}
            type="number"
          /></Fieldset
        >
        <Fieldset legend="City">
          <Input bind:value={$quoteFilter.shipTo.City} />
        </Fieldset>
        <Fieldset legend="State"
          ><Select
            options={stateOptions}
            bind:value={$quoteFilter.shipTo.StateProvinceCode}
          /></Fieldset
        >
        <Fieldset legend="Classification"
          ><Select
            options={classificationOptions}
            bind:value={$quoteFilter.classification}
          /></Fieldset
        >
        <Button on:click={clearFilters}>Clear</Button>
      </div>
      <div class="flex items-end space-x-[1rem]">
        <Fieldset legend="Showing">
          <Select bind:value={$pagination.current} options={showingOptions} />
        </Fieldset>
        <Fieldset legend="Display">
          <Select
            bind:value={$pagination.number}
            options={resultsOptions}
            on:change={() => {
              if ($pagination.current > Math.ceil(filteredResults.length / +$pagination.number) - 1)
                $pagination.current = Math.ceil(filteredResults.length / +$pagination.number) - 1;
            }}
          />
        </Fieldset>
      </div>
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
          {#each paginatedResults as result}
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
