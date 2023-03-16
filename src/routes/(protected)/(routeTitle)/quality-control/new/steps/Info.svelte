<script lang="ts">
  import { Card } from '$components';

  // props (external)
  export let currentStep: number;
  export let data;
  export let i: number;
</script>

<Card class={currentStep !== i ? 'hidden' : ''}>
  <div class="inline-grid grid-cols-[fit-content(0px)_1fr] gap-x-[1rem]">
    <div class="font-semibold whitespace-nowrap">SA #</div>
    <div>{data.orderNumber}</div>
    <div class="font-semibold whitespace-nowrap">Customer</div>
    <div>{data.soldToName}</div>
    <div class="font-semibold whitespace-nowrap">Customer #</div>
    <div>{data.soldTo}</div>
    <div class="font-semibold whitespace-nowrap">Invoice #</div>
    <div>{data.invoiceNumber}</div>
    <div class="font-semibold whitespace-nowrap">Total Items</div>
    <div>
      {data.docs.filter((doc) => doc['line-type'] === 'W' || doc['line-type'] === 'S').length}
    </div>
  </div>
</Card>
