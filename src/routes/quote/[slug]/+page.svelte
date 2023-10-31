<script>
	// imports
	import { goto } from '$app/navigation';
	import { quote as quoteStore } from '@stores';

	// components
	import { A, Button, H3, H6, Main, P, Table, Tbody, Td, Tr } from '@components';

	// handlers
	const duplicateClickHandler = () => {
		$quoteStore = {
			PackageInfo: packageInfo,
			Shipper: shipper,
			ShipTo: shipTo
		};
		goto('/');
	};

	// props (internal)

	// props (external)
	export let data;

	// props (dynamic)
	$: ({ classification, date, packageInfo, quote, rates, shipper, shipTo } = data);

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
				<P><b>Total Packages:</b></P><P>{packageInfo?.Packages}</P>
				<P><b>Total Weight:</b></P><P>{packageInfo?.Weight}</P>
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
			<Button class="self-end" on:click={duplicateClickHandler}>Duplicate</Button>
		</div>
	</div>
</Main>
