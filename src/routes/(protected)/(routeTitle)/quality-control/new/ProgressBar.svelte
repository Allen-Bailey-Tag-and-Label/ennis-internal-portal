<script lang="ts">
  import { Icon } from '$components';

  // props (external)
  export let currentStep: number;
  export let steps: { iconSrc: any; subtitle: string; title: string }[];
</script>

<div
  class="hidden gap-y-[.25rem] gap-x-[1rem] grid-cols-[fit-content(0px)_1fr] items-start lg:grid self-start"
  style="grid-template-rows:repeat({steps.length}, minmax(0, 1fr))"
>
  {#each steps as { iconSrc, subtitle, title }, i}
    <div class="flex flex-col items-end space-y-[0rem]">
      <div class="whitespace-nowrap font-semibold text-[1.25rem]">{title}</div>
      <div class="whitespace-nowrap opacity-50">{subtitle}</div>
    </div>
    <div
      class="rounded-full text-white p-[.5rem] {currentStep === i
        ? 'bg-primary-500'
        : 'bg-current'}"
    >
      <Icon class="w-[2rem] h-[2rem]" src={iconSrc} />
    </div>
  {/each}
</div>
