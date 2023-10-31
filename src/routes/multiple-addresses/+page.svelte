<script>
	import {
		Button,
		Card,
		Icon,
		Input,
		Main,
		Modal,
		ProgressIndicator,
		Select,
		Table,
		Tbody,
		Td,
		Textarea,
		Tfoot,
		Th,
		Thead,
		Tr
	} from '@components';
	import { ExclamationCircle, Trash } from 'sveltewind/components/icons';
	import { stateOptions } from '@lib/stateAbbreviations';

	// handlers
	const getRatesHandler = async () => {
		rows = [...rows].map((row) => {
			row.rate = 'loading';
			return row;
		});
		await Promise.all(
			rows.map(async (row, i) => {
				try {
					// const { AddressClassification, AddressKeyFormat } = await validateAddress(
					// 	[row.address1, row.address2],
					// 	row.city,
					// 	row.state,
					// 	row.zip
					// );
					const RatedShipment = await getRates(
						[row.address1, row.address2],
						row.city,
						row.state,
						row.zip,
						row.numberOfPackages,
						row.weight
					);
					rows[i].rate = RatedShipment.reduce((obj, rate) => {
						obj[rate.Service.Code] =
							parseFloat(rate.RatedPackage.TotalCharges.MonetaryValue) * +row.numberOfPackages;
						return obj;
					}, {});
				} catch (error) {
					// console.log(error);
					rows[i].rate = { error: { message: error } };
				}
			})
		);
	};
	const importHandler = async () => {
		rows = modal.paste.value.split('\n').map((row) =>
			row.split('\t').reduce(
				(obj, value, i) => {
					obj[columns[i].key] = value;
					return obj;
				},
				{ serviceCode }
			)
		);
		modal.paste.show = false;
		modal.paste.value = '';
	};

	// utilities
	const getRates = async (address, city, state, zip, numberOfPackages, weight) => {
		try {
			const response = await fetch('/api/getRates', {
				method: 'POST',
				header: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					RateRequest: {
						Shipment: {
							Shipper: {
								Address: {
									AddressLine: '3177 Lehigh Street',
									City: 'Caledonia',
									StateProvinceCode: 'NY',
									PostalCode: '14423',
									CountryCode: 'US'
								}
							},
							ShipTo: {
								Address: {
									AddressLine: address,
									City: city,
									StateProvinceCode: state,
									PostalCode: zip,
									CountryCode: 'US'
								}
							},
							Package: {
								PackagingType: {
									Code: '02'
								},
								PackageWeight: {
									UnitOfMeasurement: {
										Code: 'LBS'
									},
									Weight: Math.ceil(+weight / +numberOfPackages).toString()
								}
							}
						}
					}
				})
			});

			const result = await response.json();

			if (result?.RateResponse?.RatedShipment === undefined)
				throw result?.response?.errors[0]?.message;

			const {
				RateResponse: { RatedShipment }
			} = result;

			return RatedShipment;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
	const validateAddress = async (address, city, state, zip) => {
		try {
			const response = await fetch('/api/validateAddress', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					XAVRequest: {
						AddressKeyFormat: {
							AddressLine: address,
							PoliticalDivision2: city,
							PoliticalDivision1: state,
							PostcodePrimaryLow: zip,
							CountryCode: 'US'
						}
					}
				})
			});

			const result = await response.json();

			// destructure result
			const {
				XAVResponse: { Candidate, NoCandidatesIndicator }
			} = result;

			// check if no candidates available
			if (Candidate === undefined) throw 'Address could not be validated';

			// check if multiple candidates
			if (Array.isArray(Candidate)) {
				throw 'Multiple candidates were found';
			}

			const { AddressClassification, AddressKeyFormat } = Candidate;
			return { AddressClassification, AddressKeyFormat };
		} catch (error) {
			throw error;
		}
	};

	// props (internal)
	const format = {
		currency: (string) => {
			const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
			return format(string);
		}
	};
	const modal = {
		error: {
			message: '',
			show: false
		},
		paste: {
			show: false,
			value: ``
		}
	};
	let rows = [];
	let serviceCode = '03';
	const serviceCodes = {
		'03': 'Ground',
		'12': '3 Day Select',
		'02': '2nd Day Air',
		'59': '2nd Day Air A.M.',
		'13': 'Next Day Air Saver',
		'01': 'Next Day Air',
		'14': 'Next Day Air Early'
	};

	$: columns = [
		{ key: 'address1', label: 'Address' },
		{ key: 'address2', label: 'Address ( Line 2 )' },
		{ key: 'city', label: 'City' },
		{ key: 'state', label: 'State', props: { options: stateOptions }, type: 'select' },
		{ key: 'zip', label: 'ZIP', props: { class: 'ml-auto text-right w-full' } },
		{
			key: 'numberOfPackages',
			label: 'Number of Packages',
			props: { class: 'ml-auto text-right w-full' }
		},
		{ key: 'weight', label: 'Total Weight', props: { class: 'ml-auto text-right w-full' } },
		{
			key: 'serviceCode',
			label: 'Service',
			props: { options: serviceCodeOptions },
			type: 'select'
		},
		{ key: 'rate', label: 'Rate', type: 'rate' }
	];
	$: serviceCodeOptions = Object.keys(serviceCodes)
		.map((value) => {
			return { label: serviceCodes[value], value };
		})
		.sort((a, b) => a.label.localeCompare(b.label));
</script>

<Main class="flex-grow overflow-auto">
	<div class="flex flex-col space-y-[2rem] flex-grow container mx-auto py-[2rem] overflow-auto">
		<div class="flex space-x-[1rem]">
			<Button on:click={() => (modal.paste.show = true)}>Paste CSV</Button>
			<Button disabled={rows.length == 0 ? 'disabled' : undefined} on:click={getRatesHandler}
				>Get Rates</Button
			>
			<Select
				bind:value={serviceCode}
				options={serviceCodeOptions}
				on:change={() =>
					(rows = [...rows].map((row) => {
						row.serviceCode = serviceCode;
						return row;
					}))}
			/>
		</div>
		<div class="flex flex-col flex-grow overflow-auto relative items-start self-start">
			<Table>
				<Thead>
					<Th class="sticky top-0 bg-white dark:bg-gray-800 p-0" />
					{#each columns as { label }}
						<Th class="sticky top-0 bg-white dark:bg-gray-800">{label}</Th>
					{/each}
				</Thead>
				<Tbody>
					{#each rows as row, i}
						<Tr>
							<Td class="p-0">
								<Button
									class="px-[.5rem] bg-transparent hover:bg-red-500/[.1] focus:bg-red-500/[.1] dark:hover:bg-red-500/[.1] dark:focus:bg-red-500/[.1] text-red-500 focus:ring-red-500/[.3]"
									on:click={() => {
										rows = [...rows].filter((_, j) => i !== j);
									}}
									tabindex="-1"
								>
									<Icon src={Trash} />
								</Button>
							</Td>
							{#each columns as { key, props, type }}
								<Td class="p-0">
									{#if type === 'select'}
										<Select bind:value={row[key]} class="ml-auto" options={props?.options} />
									{:else if type === 'rate'}
										{#if row[key] === 'loading'}
											<div class="px-[1.5rem] py-[.5rem] flex">
												<ProgressIndicator class="w-[1.5rem] h-[1.5rem] mx-auto" />
											</div>
										{:else if row[key]?.error?.message !== undefined}
											<Button
												class="mx-auto px-[.5rem] bg-transparent hover:bg-red-500/[.1] focus:bg-red-500/[.1] dark:hover:bg-red-500/[.1] dark:focus:bg-red-500/[.1] text-red-500 focus:ring-red-500/[.3]"
												on:click={() => {
													modal.error.message = row[key].error.message;
													modal.error.show = true;
												}}
												tabindex="-1"
											>
												<Icon src={ExclamationCircle} />
											</Button>
										{:else}
											<div class="px-[1.5rem] py-[.5rem] text-right">
												{format.currency(
													isNaN(row[key]?.[row.serviceCode]) ? 0 : row[key]?.[row.serviceCode]
												)}
											</div>
										{/if}
									{:else}
										<Input bind:value={row[key]} {...props} />
									{/if}
								</Td>
							{/each}
						</Tr>
					{/each}
				</Tbody>
				<Tfoot>
					<Th class="sticky bottom-0 z-[1] bg-white dark:bg-gray-800" colspan="6" />
					<Th class="sticky bottom-0 text-right z-[1] bg-white dark:bg-gray-800"
						>{rows.reduce((total, row) => total + +row.numberOfPackages, 0)}</Th
					>
					<Th class="sticky bottom-0 text-right z-[1] bg-white dark:bg-gray-800"
						>{rows.reduce((total, row) => total + +row.weight, 0)}</Th
					>
					<Th class="sticky bottom-0 z-[1] bg-white dark:bg-gray-800" />
					<Th class="sticky bottom-0 text-right z-[1] bg-white dark:bg-gray-800">
						{format.currency(
							rows.reduce(
								(total, row) =>
									total + (isNaN(row.rate?.[row.serviceCode]) ? 0 : row.rate?.[row.serviceCode]),
								0
							)
						)}
					</Th>
				</Tfoot>
			</Table>
		</div>
	</div>
</Main>

<Modal bind:show={modal.error.show} class="items-stretch justify-normal">
	<div class="flex-grow p-[1.5rem] flex flex-col">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-h-screen transform transition duration-500 w-full flex-grow text-red-500 {modal
				.error.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			{modal.error.message}
		</Card>
	</div>
</Modal>
<Modal bind:show={modal.paste.show} class="items-stretch justify-normal">
	<div class="flex-grow p-[1.5rem] flex flex-col">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-h-screen transform transition duration-500 w-full flex-grow {modal
				.paste.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<Textarea bind:value={modal.paste.value} class="flex-grow" />
			<Button class="self-end" on:click={importHandler}>Import</Button>
		</Card>
	</div>
</Modal>
