<script lang="ts">
  import { onMount } from 'svelte';
  import { DataTable } from '$components';

  // props (internal)
  let columns = [
    { key: 'firstName', th: 'First', type: 'string' },
    { key: 'lastName', th: 'Last', type: 'string' },
    { class: 'font-mono text-right', key: 'rate', th: 'Rate', type: 'string' },
    { class: 'font-mono text-right', key: 'absences', th: 'Absences' },
    { class: 'font-mono text-right', key: 'efficiency', th: 'Efficiency' },
    {
      class: 'font-mono text-right w-[5rem]',
      key: 'adaptibility',
      th: 'Adaptibility ( 0-10 )',
      type: 'int'
    },
    {
      class: 'font-mono text-right w-[5rem]',
      key: 'attitude',
      th: 'Attitude ( 0-10 )',
      type: 'int'
    },
    { class: 'font-mono text-right w-[5rem]', key: 'quality', th: 'Quality ( 0-10 )', type: 'int' },
    { key: 'suggestedIncreasePercent', th: 'Suggested Increase %' }
  ];
  const fye = '2024';
  const maxPercent = 0.045;
  let rows: { [key: string]: any } = [];

  // props (external)
  export let data: { employees: { [key: string]: any }[] };

  // lifecycle
  onMount(() => {
    rows = data.employees;
  });
</script>

<div class="font-semibold text-[1.25rem] mb-[1rem]">FYE: {fye}</div>
<DataTable bind:columns bind:rows isDeleteable={false} />
