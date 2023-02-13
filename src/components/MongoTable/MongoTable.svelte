<script lang="ts">
  import { deserialize } from '$app/forms';
  import { Card, DataTable, Icon } from '$components';
  import { Exclamation } from '$icons';

  // props (external)
  export let addHandler = async () => {
    // initiate doc
    const doc = [...columns]
      .filter(({ key }) => key !== 'dtSelect')
      .reduce((obj, column) => {
        obj[column.key] = '';
        return obj;
      }, {});

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
  export let collection: blob | string | undefined = undefined;
  export let columns:
    | {
        changeHandler?: Function | undefined;
        checked?: string | boolean | undefined;
        classes?: string | undefined;
        editable?: boolean | undefined;
        key: string;
        th: string;
        type?: string | undefined;
      }[]
    | undefined = [];
  export let deleteHandler = async () => {
    // initiate query
    const query: { $or: { [key: string]: string }[] } = { $or: [] };

    // add selected rows to query
    [...rows]
      .filter(({ dtSelect }) => dtSelect)
      .map(({ _id }) => {
        query.$or = [...query.$or, { _id }];
      });

    // create formData
    const formData = new FormData();

    // append values
    formData.append('collection', collection);
    formData.append('query', JSON.stringify(query));

    // post to formaction
    await fetch('/api/mongodb?/delete', {
      body: formData,
      method: 'post'
    });

    // delete rows on screen
    rows = [...rows].filter(({ dtSelect }) => !dtSelect);
  };
  export let rows: {
    [key: string]: any;
  }[] = [];
  export let sort = undefined;

  $: if (rows) {
    rows = rows.map((row) => {
      return {
        changeHandler: async ({ key, value }: { key: string; value: string }) => {
          // exit if key is dtSelect
          if (['dtSelect'].includes(key)) return;

          // create query
          const query = { _id: row._id };

          // create update
          const update: { $set: { [key: string]: string } } = { $set: {} };

          // update key on $set property
          update.$set[key] = value;

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
</script>

{#if collection}
  <DataTable
    {...$$restProps}
    bind:addHandler
    bind:columns
    bind:deleteHandler
    bind:rows
    bind:sort
    class={$$props.class}
  />
{/if}
{#if !collection}
  <Card
    class="self-start p-[1rem] shadow-none dark:shadow-none ring-1 ring-red-500 dark:ring-red-500 bg-red-500/[.1] dark:bg-red-500/[.1] text-red-500"
  >
    <div class="font-semibold flex items-center space-x-[.5rem]">
      <Icon src={Exclamation} />
      <div>Warning</div>
    </div>
    <div>No collection provided for MongoTable</div>
  </Card>
{/if}
