<script lang="ts">
  import { onMount } from 'svelte';
  import { deserialize } from '$app/forms';
  import { MongoTable } from '$components';
  import type { PageData } from './$types';

  // props (internal)
  let addHandler = async () => {
    // initiate doc
    const doc = { name: '', routes: [] };

    // create formData
    const formData = new FormData();

    // append values
    formData.append('collection', collection);
    formData.append('doc', JSON.stringify(doc));

    // post to formaction
    const response = await fetch('/api/mongodb?/create', {
      body: formData,
      headers: {
        Accept: 'application/json'
      },
      method: 'post'
    });

    const {
      data: { insertedDoc }
    } = deserialize(await response.text());

    // add doc to rows
    rows = [...rows, insertedDoc];
  };
  let collection = 'roles';
  let columns = [{ key: 'name', th: 'Name', type: 'input' }];
  let rows: {
    group: string;
    name: string;
    route: string;
  }[] = [];

  // props (external)
  export let data: PageData;

  // props (dynamic)
  $: if (rows) {
    rows = rows.map((row) => {
      return {
        changeHandler: async ({ key, value }) => {
          // create query
          const query = { _id: row._id };

          // find current role
          const role = [...rows].find((role) => role._id === row._id);

          // create update
          const update = {
            $set: {}
          };

          // check if key is name
          if (key === 'name') update.$set.name = value;
          if (key !== 'name')
            update.$set.routes = data.routes
              .filter((route) => role[route._id])
              .map(({ _id }) => _id);

          // create formData
          const formData = new FormData();

          // append values
          formData.append('collection', collection);
          formData.append('query', JSON.stringify(query));
          formData.append('update', JSON.stringify(update));

          // post to formaction
          await fetch('/api/mongodb?/update', {
            body: formData,
            method: 'post'
          });
        },
        ...row
      };
    });
  }

  // lifecycle
  onMount(() => {
    columns = [
      ...columns,
      ...data.routes
        .map(({ _id, group, name }) => {
          let th = [];
          if (group !== '') th.push(group);
          th.push(name);
          th = th.join(' - ');
          return { key: _id, th, type: 'checkbox' };
        })
        .sort((a, b) => (a.th < b.th ? -1 : a.th > b.th ? 1 : 0))
    ];
    rows = data.roles.map((role) => {
      return {
        _id: role._id,
        name: role.name,
        ...[...data.routes].reduce((obj, route) => {
          obj[route._id] = role.routes.includes(route._id);
          return obj;
        }, {})
      };
    });
  });
</script>

<div class="flex flex-col flex-grow overflow-auto p-[1px]">
  <MongoTable bind:addHandler bind:collection bind:columns bind:rows />
</div>
