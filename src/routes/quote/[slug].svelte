<script>
  // imports

  // components
  import { A, H3, H6, Main, P, SafeArea, Table, Tbody, Td, Tr } from '@components';

  // handlers

  // props (internal)

  // props (external)
  export let classification = '';
  export let date = '';
  export let quote = 0;
  export let rates = [];
  export let shipper = {};
  export let shipTo = {};

  // props (dynamic)
  $: console.log({ classification, rates, shipTo });

  Object.assign(String.prototype, {
    toCurrency() {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      return formatter.format(this);
    }
  });
</script>

<Main>
  <SafeArea class="overflow-y-auto">
    <div class="flex flex-grow items-center justify-center">
      <div class="flex flex-col space-y-[1rem]">
        <H3 class="text-[1rem] leading-[1rem] lg:text-[3rem] lg:leading-[3rem]">Quote #{quote}</H3>
        <div class="grid grid-cols-[fit-content(200px)_1fr] gap-[.5rem]">
          <P><b>Date:</b></P>
          <P>{new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}</P>
          <P><b>Ship From:</b></P><P
            >{shipper.AddressLine}
            {shipper.City}, {shipper.StateProvinceCode}
            {shipper.PostalCode}</P
          >
          <P><b>Ship To:</b></P><P
            >{shipTo.AddressLine} {shipTo.City}, {shipTo.StateProvinceCode} {shipTo.PostalCode}</P
          >
          <P><b>Classification:</b></P><P>{classification}</P>
        </div>
        <Table>
          <Tbody>
            {#each rates as rate}
              <Tr>
                <Td>UPS {rate.description}</Td>
                <Td class="text-right">{rate.rate.toString().toCurrency()}</Td>
              </Tr>
            {/each}
          </Tbody>
        </Table>
      </div>
    </div>
  </SafeArea>
</Main>
