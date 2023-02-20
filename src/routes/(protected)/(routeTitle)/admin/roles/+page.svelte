<script lang="ts">
  import { onMount } from 'svelte';
  import { deserialize } from '$app/forms';
  import { MongoTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  // let addHandler = async () => {
  //   // initiate doc
  //   const doc = { name: '', routes: [] };

  //   // create formData
  //   const formData = new FormData();

  //   // append values
  //   formData.append('collection', collection);
  //   formData.append('doc', JSON.stringify(doc));

  //   // post to formaction
  //   const response = await fetch('/api/mongodb?/create', {
  //     body: formData,
  //     headers: {
  //       Accept: 'application/json'
  //     },
  //     method: 'post'
  //   });

  //   const {
  //     data: { insertedDoc }
  //   } = deserialize(await response.text());

  //   // add doc to rows
  //   rows = [...rows, insertedDoc];
  // };
  let collection = 'roles';
  let columns = [{ key: 'name', th: 'Name', type: 'input' }];
  let rows: {
    group: string;
    name: string;
    route: string;
  }[] = [];

  // props (external)
  export let data: PageData;

  // lifecycle
  onMount(() => {
    columns = [
      ...columns,
      {
        class: 'min-w-[60rem]',
        key: 'routes',
        options: data.routes
          .map((route) => {
            let label = [];
            if (route?.group) label.push(route.group);
            label.push(route.name);
            return { label: label.join(' - '), value: route._id };
          })
          .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)),
        th: 'Routes',
        type: 'multipleInput'
      }
    ];
    rows = data.roles;
  });
  $: console.log(rows[0]);
</script>

<div class="flex flex-col flex-grow overflow-auto p-[1px]">
  <MongoTable class="overflow-visible" bind:collection bind:columns bind:rows />
</div>
