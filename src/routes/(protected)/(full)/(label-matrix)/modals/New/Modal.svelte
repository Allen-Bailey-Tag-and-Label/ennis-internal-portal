<script lang="ts">
  import { deserialize, enhance } from '$app/forms';
  import { Fieldset, Input, Modal } from '$components';
  import { objectToFormData } from '$lib/format';
  import store from './store';

  // handlers
  // const confirmHandler = async () => {
  //   const response = await fetch('/label-matrix/view-edit?/new', {
  //     body: objectToFormData({
  //       height: $store.height,
  //       name: $store.name,
  //       width: $store.width
  //     }),
  //     method: 'post'
  //   });
  //   const data = deserialize(await response.text());
  //   console.log(response, data);
  // };
</script>

<Modal action="/label-matrix/view-edit?/new" bind:isOpen={$store.isOpen}>
  <svelte:fragment slot="title">New</svelte:fragment>
  <div class="grid grid-cols-2 gap-[1rem]" slot="body">
    <Fieldset legend="Width">
      <Input
        bind:value={$store.width}
        class="text-right w-[10rem]"
        min="0"
        max="50"
        name="width"
        required={true}
        step=".0001"
        tabindex={!$store.isOpen ? '-1' : undefined}
        type="number"
      />
    </Fieldset>
    <Fieldset legend="Height">
      <Input
        bind:value={$store.height}
        class="text-right w-[10rem]"
        min="0"
        max="50"
        name="height"
        step=".0001"
        required={true}
        tabindex={!$store.isOpen ? '-1' : undefined}
        type="number"
      />
    </Fieldset>
    <Fieldset class="col-span-2" legend="Name">
      <Input
        bind:value={$store.name}
        name="name"
        required={true}
        tabindex={!$store.isOpen ? '-1' : undefined}
      />
    </Fieldset>
  </div>
</Modal>
