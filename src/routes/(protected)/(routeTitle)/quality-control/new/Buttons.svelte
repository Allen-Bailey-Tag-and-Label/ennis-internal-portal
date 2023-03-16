<script lang="ts">
  import { Button } from '$components';

  // props (external)
  export let currentStep: number;
</script>

<div class="flex space-x-[1rem] {currentStep === 0 ? 'justify-end' : 'justify-between'}">
  {#if currentStep > 0}
    <Button on:click={() => (currentStep = currentStep - 1)}>Back</Button>
  {/if}
  {#if currentStep < 5}
    <Button class="self-end" on:click={() => (currentStep = currentStep + 1)}>Next</Button>
  {/if}
</div>
