<script lang="ts">
  import { clickOutside } from '$actions';
  import { Button, Card } from '$components';
  import navStore from './NavStore';
</script>

<div class="flex">
  {#each Object.values($navStore) as { isOpen, label, menuItems = { } }}
    <div class="relative" use:clickOutside={() => (isOpen = false)}>
      <Button on:click={() => (isOpen = !isOpen)}>{label}</Button>
      <Card
        class="absolute left-0 bottom-0 px-[0] py-[.25rem] transition duration-200 bg-primary-500 dark:bg-primary-500 {!isOpen
          ? 'translate-y-[calc(100%_-_.5rem)] opacity-0 pointer-events-none'
          : 'translate-y-full opacity-100 pointer-events-auto'}"
      >
        {#each Object.values(menuItems) as { clickHandler, disabled, keyboardControl, label }}
          <Button
            {disabled}
            on:click={async () => {
              await clickHandler();
              isOpen = false;
            }}
            tabindex={!isOpen ? '-1' : undefined}
          >
            <div class="flex flex-grow justify-between items-center">
              <div class="whitespace-nowrap pr-[2rem]">{label}</div>
              <div class="whitespace-nowrap">
                {@html [
                  keyboardControl.ctrlKey ? 'Ctrl' : false,
                  keyboardControl?.shiftKey ? 'Shift' : false,
                  keyboardControl.key !== '' ? keyboardControl.key.toUpperCase() : false
                ]
                  .filter((v) => v !== false)
                  .join('<span class="opacity-50"> + </span>')}
              </div>
            </div>
          </Button>
        {/each}
      </Card>
    </div>
  {/each}
</div>
