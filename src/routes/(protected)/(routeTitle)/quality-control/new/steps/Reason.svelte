<script lang="ts">
  import { Card } from '$components';

  // props (external)
  export let currentStep: number;
  export let data;
  export let i: number;
</script>

<Card class={currentStep !== i ? 'hidden' : ''}>Reason</Card>
