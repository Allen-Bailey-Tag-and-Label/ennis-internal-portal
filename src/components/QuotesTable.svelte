<script>
  import { goto } from '$app/navigation';
  import { A, Button, Table, Tbody, Td, Th, Thead, Tr } from '@components';
  import { quote, theme } from '@stores';

  // props (external)
  export let paginatedResults = [];
</script>

<Table>
  <Thead>
    <Th class="text-right">Quote #</Th>
    <Th class="text-right">Date</Th>
    <Th>Address</Th>
    <Th class="text-right">ZIP</Th>
    <Th>City</Th>
    <Th>State</Th>
    <Th>Classification</Th>
    <Th />
  </Thead>
  <Tbody>
    {#each paginatedResults as result}
      <Tr>
        <Td class="text-right">{result.quote}</Td>
        <Td class="text-right"
          >{new Date(result.date).toLocaleDateString()}
          {new Date(result.date).toLocaleTimeString()}</Td
        >
        <Td>{result.shipTo.AddressLine}</Td>
        <Td class="text-right">{result.shipTo.PostalCode}</Td>
        <Td>{result.shipTo.City}</Td>
        <Td>{result.shipTo.StateProvinceCode}</Td>
        <Td>{result.classification}</Td>
        <Td class="text-center">
          <div class="flex space-x-[.5rem]">
            <A class="{$theme.aButton} before:hidden inline-block" href={`/quote/${result.quote}`}
              >View</A
            >
            <Button
              on:click={() => {
                $quote = {
                  PackageInfo: result.packageInfo,
                  Shipper: result.shipper,
                  ShipTo: result.shipTo
                };
                goto('/');
              }}
            >
              Duplicate
            </Button>
          </div>
        </Td>
      </Tr>
    {/each}
  </Tbody>
</Table>
