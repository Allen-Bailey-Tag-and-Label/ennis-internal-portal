<script lang="ts">
  import { Button } from '$components';

  // props (external)
  export let currentStep: number;
  export let steps;
</script>

<div class="flex space-x-[1rem] justify-end">
  {#if currentStep > 0}
    <Button on:click={() => (currentStep = currentStep - 1)}>Back</Button>
  {/if}
  {#if currentStep < steps.length - 1}
    <Button class="self-end" on:click={() => (currentStep = currentStep + 1)}>Next</Button>
  {/if}
  {#if currentStep === steps.length - 1}
    <Button class="self-end" type="submit">Submit</Button>
  {/if}
</div>
