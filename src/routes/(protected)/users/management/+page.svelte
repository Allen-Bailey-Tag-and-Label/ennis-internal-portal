<script lang="ts">
  import crypto from 'crypto-js';
  import { onMount } from 'svelte';
  import { deserialize } from '$app/forms';
  import { MongoTable } from '$components';

  // props (internal)
  let addHandler = async () => {
    // initiate doc
    const doc = [...columns]
      .filter(({ key }) => key !== 'dtSelect')
      .reduce((obj, column) => {
        obj[column.key] = '';
        return obj;
      }, {});

    // update password keys
    doc.initialPassword = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');
    doc.password = JSON.stringify(crypto.SHA256(doc.initialPassword).words);
    doc.roles = [];

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
  let collection = 'users';
  let columns = [];
  let rows: {}[] = [];

  // props (external)
  export let data;

  // lifecycle
  onMount(() => {
    columns = [
      { key: 'firstName', th: 'First' },
      { key: 'lastName', th: 'Last' },
      { key: 'email', th: 'Email' },
      { key: 'ennisId', th: 'Ennis #', type: 'int' },
      { key: 'extension', th: 'Extension', type: 'int' },
      { key: 'hireDate', th: 'Hired', type: 'date' },
      { key: 'initialPassword', th: 'Initial Password', type: 'int' },
      {
        class: 'min-w-[40rem]',
        options: data.roles
          .map((role) => {
            return { label: role.name, value: role._id };
          })
          .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)),
        key: 'roles',
        th: 'Roles',
        type: 'multipleInput'
      },
      { key: 'redirectSignIn', th: 'Sign In Route' },
      {
        options: data.users
          .map((user) => {
            return { label: `${user.firstName} ${user.lastName}`, value: user._id };
          })
          .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)),
        key: '_supervisorId',
        th: 'Supervisor',
        type: 'select'
      },
      { key: 'username', th: 'Username' },
      { key: 'exempt', th: 'Exempt', type: 'checkbox' },
      { key: 'isActive', th: 'Active', type: 'checkbox' }
    ];
    rows = data.users;
  });
</script>

<div class="flex flex-col flex-grow overflow-hidden">
  <MongoTable bind:addHandler bind:collection bind:columns bind:rows />
</div>
