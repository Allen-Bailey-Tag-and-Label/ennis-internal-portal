<script lang="ts">
  import { clickOutside, copy, copyToClipboard } from '$actions';
  import { Button, Card, Icon, Modal } from '$components';
  import { Clipboard, DocumentDownload, DotsVertical, Exclamation, Plus, Trash } from '$icons';
  import MenuButton from './MenuButton.svelte';

  // handlers
  const copyHandler = () => {
    // get tsv (tab separated view)
    const tsv = tableToString({ delimiter: '\t' });

    copyToClipboard(tsv);
  };
  const hideMenu = () => (isMenuOpen = false);
  const tableToString = ({ delimiter = ',' }) => {
    // get valid columns
    const validColumns = columns.filter(({ key }) => key !== 'dtSelect');

    // get headers
    const headers = validColumns.map(({ th }) => th).join(delimiter);

    // get body
    const body = rows.map((row) =>
      validColumns
        .map(({ options, key, type }) => {
          if (type === 'multipleInput')
            return row[key]
              .map((value) => options.find((option) => option.value === value).label)
              .join(', ');
          return row[key];
        })
        .join(delimiter)
    );

    // get string
    const string = [headers, ...body].join('\n');

    return string;
  };
  const toggleMenu = () => (isMenuOpen = !isMenuOpen);

  // props (internal)
  let isMenuOpen = false;
  let isDeleteModalOpen = false;

  // props (external)
  export let addHandler = () => {
    rows = [
      ...rows,
      [...columns].reduce((obj, column) => {
        obj[column.key] = '';
        return obj;
      }, {})
    ];
  };
  export let columns: {
    changeHandler?: Function;
    checked?: boolean | string;
    classes?: string;
    editable?: boolean;
    key: string;
    th: string;
    type?: string;
  }[] = [];
  export let isAddable = true;
  export let isDeleteable = true;
  export let isExportable = true;
  export let deleteHandler = () => {
    rows = rows.filter((row) => !row?.dtSelect);
  };
  export let rows: { [key: string]: any }[] = [];

  // props (dynamic)
  $: selectedRows = [...rows].filter((row) => row?.dtSelect);
  $: shouldShowOptions = isAddable || isDeleteable || isExportable;
</script>

<Modal bind:confirmHandler={deleteHandler} bind:isOpen={isDeleteModalOpen} showHeader={false}>
  <svelte:fragment slot="body">
    <div class="flex flex-col  space-y-[1rem]">
      <div class="text-center text-[1.5rem] font-semibold">Delete rows?</div>
      <div class="text-center ">
        Are you sure you want to delete {selectedRows.length} row{selectedRows.length === 1
          ? ''
          : 's'}?
      </div>
      <Card
        class="p-[1rem] shadow-none dark:shadow-none ring-1 ring-red-500 dark:ring-red-500 bg-red-500/[.1] dark:bg-red-500/[.1] text-red-500"
      >
        <div class="font-semibold flex items-center space-x-[.5rem]">
          <Icon src={Exclamation} />
          <div>Warning</div>
        </div>
        <div>This cannot be undone</div>
      </Card>
    </div>
  </svelte:fragment>
</Modal>

{#if shouldShowOptions}
  <div class="fixed top-0 right-0 z-[2] pt-[max(1rem,_env(safe-area-inset-top))] p-[1rem]">
    <div class="relative" use:clickOutside={hideMenu}>
      <Button class="px-[.5rem]" on:click={toggleMenu}>
        <Icon src={DotsVertical} />
      </Button>
      <Card
        class="px-0 py-[.5rem] transition duration-200 absolute top-[2.5rem] right-0 bg-primary-500 text-white dark:bg-primary-500 {!isMenuOpen
          ? 'opacity-0 pointer-events-none translate-y-[-.5rem]'
          : 'opacity-100 pointer-events-auto translate-y-0'}"
      >
        {#if isAddable}
          <MenuButton
            on:click={async () => {
              await addHandler();
              isMenuOpen = false;
            }}
            {isMenuOpen}
            src={Plus}>Add</MenuButton
          >
        {/if}
        {#if isExportable}
          <MenuButton {isMenuOpen} on:copied={copyHandler} src={Clipboard} use={[copy]}
            >Copy to Clipboard</MenuButton
          >
        {/if}
        {#if selectedRows.length > 0}
          <MenuButton
            on:click={() => {
              isDeleteModalOpen = true;
              isMenuOpen = false;
            }}
            {isMenuOpen}
            src={Trash}>Delete Selected</MenuButton
          >
        {/if}
        {#if isExportable}
          <MenuButton {isMenuOpen} src={DocumentDownload}>Export CSV</MenuButton>
        {/if}
      </Card>
    </div>
  </div>
{/if}
