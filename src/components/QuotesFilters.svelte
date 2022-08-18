<script>
  import { Button, Fieldset, Input, Select } from '@components';
  import { stateOptions } from '@lib/stateAbbreviations';
  import { quoteFilter } from '@stores';

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

  // props (internal)
  const classificationOptions = [
    { label: '', value: '' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Residential', value: 'Residential' },
    { label: 'Unclassified', value: 'Unclassified' },
    { label: 'Unknown', value: 'Unknown' }
  ];
</script>

<div class="flex flex-row space-y-0 items-end space-x-[1rem]">
  <Fieldset legend="Quote #">
    <Input bind:value={$quoteFilter.quote} class="pr-[.5rem] text-right w-[7rem]" type="number" />
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
    ><Select options={stateOptions} bind:value={$quoteFilter.shipTo.StateProvinceCode} /></Fieldset
  >
  <Fieldset legend="Classification"
    ><Select options={classificationOptions} bind:value={$quoteFilter.classification} /></Fieldset
  >
  <Button on:click={clearFilters}>Clear</Button>
</div>
