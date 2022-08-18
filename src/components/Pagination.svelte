<script>
  import { Fieldset, Select } from '@components';
  import { pagination } from '@stores';

  // props (internal)
  const resultsOptions = [
    { label: '10 results', value: 10 },
    { label: '25 results', value: 25 },
    { label: '50 results', value: 50 },
    { label: '100 results', value: 100 },
    { label: 'All', value: 'All' }
  ];

  // props (external)
  export let filteredResults = [];
  export let showingOptions = [];
</script>

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
