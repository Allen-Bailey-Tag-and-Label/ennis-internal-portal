<script lang="ts">
  import { onMount } from 'svelte';
  import { DataTable } from '$components';

  // props (internal)
  let columns = [
    { key: 'date', th: 'Date' },
    { key: 'costCenter', th: 'Cost Center' },
    { key: 'ennisId', th: 'Employee Number' },
    { key: 'lastName', th: 'Last' },
    { key: 'firstName', th: 'First' },
    { key: 'hireDate', th: 'Date of Hire' },
    { key: 'jobTitle', th: 'Job Title' },
    { key: 'jobCode', th: 'Job Code' },
    { key: 'eeoClassification', th: 'EEO Classification' },
    { key: 'workCompClass', th: 'Work Comp Class' },
    { key: 'previous', th: 'Previous' },
    { key: 'after', th: 'After' },
    { key: 'percent', th: 'Percent' },
    { key: 'code', th: 'Code' },
    { key: 'description', th: 'Explanation' },
    { key: 'explanation', th: 'Description' }
  ];
  let rows: {}[] = [];
  let sort = { key: 'afterDate', direction: 1 };

  // props (external)
  export let data: {
    mostRecentPcrs: {
      date: string;
    }[];
  };

  // lifecycle
  onMount(() => {
    sort = { key: 'date', direction: 1 };
    rows = data.mostRecentPcrs.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  });
</script>

<div class="flex flex-col flex-grow overflow-hidden">
  <DataTable bind:columns bind:rows bind:sort isEditable={false} />
</div>
