<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { Form } from '$components';
  import Navigation from './Navigation.svelte';
  import Progress from './Progress.svelte';
  import type { ActionResult } from '@sveltejs/kit';

  // handlers
  async function submitHandler(e) {
    e.preventDefault();

    if (currentStep < steps.length - 1) {
      currentStep = currentStep + 1;
      return;
    }

    const formData = new FormData(this);

    const response = await fetch(this.action, {
      method: 'POST',
      body: formData
    });

    const result: ActionResult = deserialize(await response.text());

    if (result.type === 'success') {
      await invalidateAll();
    }

    applyAction(result);
  }

  // props (external)
  export let action: undefined | string = undefined;
  export let currentStep: number = 0;
  export let data;
  export let steps: { component: ComponentType; iconSrc: any; subtitle: string; title: string }[] =
    [];
</script>

<form
  {action}
  class="flex flex-col flex-grow max-w-none lg:flex-row lg:space-x-[2rem] lg:space-y-0"
  on:submit={submitHandler}
>
  <Progress bind:currentStep {steps} />
  <div class="flex flex-col flex-grow space-y-[1rem]">
    <div class="flex flex-col space-y-[1rem]">
      <div class="">Step {currentStep + 1}/{steps.length}</div>
      {#each steps as { component }, i}
        {#if currentStep >= i}
          <svelte:component this={component} bind:currentStep bind:data {i} />
        {/if}
      {/each}
    </div>
    <Navigation bind:currentStep {steps} />
  </div>
</form>
