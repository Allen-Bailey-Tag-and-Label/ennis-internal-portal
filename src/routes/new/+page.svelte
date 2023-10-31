<script>
	// imports
	import { goto } from '$app/navigation';
	import { stateOptions } from '@lib/stateAbbreviations';
	import { quote } from '@stores';
	import zipcodes from 'zipcodes';

	// components
	import {
		Button,
		Card,
		Fieldset,
		Form,
		H3,
		H6,
		Icon,
		Input,
		Main,
		Modal,
		P,
		Select,
		SubmitButton
	} from '@components';
	import { XMark } from 'sveltewind/components/icons';

	// handlers
	const chooseCandidate = (AddressKeyFormat) => {
		updateShipToAddress(AddressKeyFormat);
		modal.candidate.show = false;
		submitted = false;
		submitHandler();
	};
	const getRates = async () => {
		modal.progress.rates.show = true;
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
							Address: $quote.Shipper
						},
						ShipTo: {
							Address: $quote.ShipTo
						},
						Package: {
							PackagingType: {
								Code: '02'
							},
							PackageWeight: {
								UnitOfMeasurement: {
									Code: 'LBS'
								},
								Weight: Math.ceil(
									+$quote.PackageInfo.Weight / +$quote.PackageInfo.Packages
								).toString()
							}
						}
					}
				}
			})
		});

		const result = await response.json();

		rates = result.RateResponse.RatedShipment.reduce((obj, { Service, TotalCharges }) => {
			const row = {
				description: serviceCodes[Service.Code],
				rate: +TotalCharges.MonetaryValue * +$quote.PackageInfo.Packages
			};
			return [...obj, row];
		}, []).sort((a, b) => {
			if (a.rate < b.rate) return -1;
			if (a.rate > b.rate) return 1;
			return 0;
		});

		modal.progress.rates.show = false;
	};
	const nonValidatedRate = async () => {
		if (submitted) return;
		classification = 'Unclassified';
		submitted = true;
		try {
			await getRates();
			await saveQuote();
			goto(`/quote/${quoteNum}`);
		} catch (error) {
			modal.error.body = error;
			modal.error.show = true;
			console.log({ error });
		}
		submitted = false;
	};
	const saveQuote = async () => {
		modal.progress.saveQuote.show = true;
		const response = await fetch('/api/saveQuote', {
			method: 'POST',
			header: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				classification,
				PackageInfo: $quote.PackageInfo,
				rates,
				Shipper: $quote.Shipper,
				ShipTo: $quote.ShipTo
			})
		});
		const result = await response.json();
		quoteNum = result.quote;
		modal.progress.saveQuote.show = false;
	};
	const submitHandler = async (e) => {
		try {
			e.preventDefault();
		} catch (error) {}
		if (submitted) return;
		submitted = true;
		try {
			await validateAddress();
			await getRates();
			await saveQuote();
			goto(`/quote/${quoteNum}`);
		} catch (error) {
			modal.error.body = error;
			modal.error.show = true;
			modal.progress.rates.show = false;
			modal.progress.validation.show = false;
			console.log({ error });
		}
		submitted = false;
	};
	const updateShipToAddress = ({
		AddressLine,
		PoliticalDivision1,
		PoliticalDivision2,
		PostcodePrimaryLow
	}) => {
		$quote.ShipTo = {
			AddressLine: AddressLine,
			City: PoliticalDivision2,
			StateProvinceCode: PoliticalDivision1,
			PostalCode: PostcodePrimaryLow,
			CountryCode: 'US'
		};
	};
	const validateAddress = async () => {
		modal.progress.validation.show = true;
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
							AddressLine: [$quote.ShipTo.AddressLine],
							PoliticalDivision2: $quote.ShipTo.City,
							PoliticalDivision1: $quote.ShipTo.StateProvinceCode,
							PostcodePrimaryLow: $quote.ShipTo.PostalCode,
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
			console.log({ Candidate, NoCandidatesIndicator });

			// check if no candidates available
			if (Candidate === undefined) throw 'Address could not be validated';

			// check if multiple candidates
			if (Array.isArray(Candidate)) {
				modal.progress.validation.show = false;
				modal.candidate.candidates = Candidate;
				modal.candidate.show = true;
				throw 'Multiple candidates were found';
			}

			const { AddressClassification, AddressKeyFormat } = Candidate;
			classification = AddressClassification.Description;
			updateShipToAddress(AddressKeyFormat);
		} catch (error) {
			throw error;
		}
		modal.progress.validation.show = false;
	};
	const zipChangeHandler = (whichAddress) => {
		const zip = whichAddress === 'shipper' ? $quote.Shipper.PostalCode : $quote.ShipTo.PostalCode;
		const result = zipcodes.lookup(zip);
		if (result !== undefined) {
			if (whichAddress === 'shipper') {
				$quote.Shipper.City = result.city;
				$quote.Shipper.StateProvinceCode = result.state;
			}
			if (whichAddress === 'shipTo') {
				$quote.ShipTo.City = result.city;
				$quote.ShipTo.StateProvinceCode = result.state;
			}
		}
	};

	// props (internal)
	let classification = 'Unclassified';
	let modal = {
		candidate: {
			candidates: [],
			show: false
		},
		error: {
			body: '',
			show: false
		},
		progress: {
			rates: {
				show: false
			},
			saveQuote: {
				show: false
			},
			validation: {
				show: false
			}
		}
	};
	let quoteNum = 0;
	let rates = {};
	const serviceCodes = {
		'03': 'Ground',
		'12': '3 Day Select',
		'02': '2nd Day Air',
		'59': '2nd Day Air A.M.',
		'13': 'Next Day Air Saver',
		'01': 'Next Day Air',
		'14': 'Next Day Air Early'
	};
	let submitted = false;

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

<Main class="flex-grow overflow-auto">
	<div class="flex flex-grow items-center justify-center">
		<Form on:submit={submitHandler}>
			<H3 class="text-[1rem] lg:text-[3rem]">UPS Ground Freight Calculation</H3>
			<div
				class="flex flex-col space-y-[1rem] lg:space-y-[0] lg:flex-row lg:flex-grow lg:space-x-[1rem]"
			>
				<div class="flex flex-col space-y-[1rem] flex-grow">
					<H6>Ship From</H6>
					<Fieldset legend="Address"><Input bind:value={$quote.Shipper.AddressLine} /></Fieldset>
					<Fieldset legend="ZIP"
						><Input
							type="number"
							bind:value={$quote.Shipper.PostalCode}
							on:change={() => zipChangeHandler('shipper')}
						/></Fieldset
					>
					<Fieldset legend="City"><Input bind:value={$quote.Shipper.City} /></Fieldset>
					<Fieldset legend="State"
						><Select
							options={stateOptions}
							bind:value={$quote.Shipper.StateProvinceCode}
						/></Fieldset
					>
				</div>
				<div class="flex flex-col space-y-[1rem] flex-grow">
					<H6>Ship To</H6>
					<Fieldset legend="Address"><Input bind:value={$quote.ShipTo.AddressLine} /></Fieldset>
					<Fieldset legend="ZIP"
						><Input
							type="number"
							bind:value={$quote.ShipTo.PostalCode}
							on:change={() => zipChangeHandler('shipTo')}
						/></Fieldset
					>
					<Fieldset legend="City"><Input bind:value={$quote.ShipTo.City} /></Fieldset>
					<Fieldset legend="State"
						><Select
							options={stateOptions}
							bind:value={$quote.ShipTo.StateProvinceCode}
						/></Fieldset
					>
				</div>
				<div class="flex flex-col space-y-[1rem] flex-grow">
					<H6>Package Info</H6>
					<Fieldset legend="Total Packages"
						><Input
							class="text-right"
							type="number"
							bind:value={$quote.PackageInfo.Packages}
						/></Fieldset
					>
					<Fieldset legend="Total Weight"
						><Input
							class="text-right"
							type="number"
							bind:value={$quote.PackageInfo.Weight}
						/></Fieldset
					>
				</div>
			</div>
			<div class="flex items-center justify-end space-x-[.5rem]">
				<SubmitButton
					class="bg-transparent hover:bg-transparent focus:bg-transparent ring-offset-1 ring-offset-gray-300 ring-black/[.0] hover:ring-offset-blue-500 focus:ring-offset-blue-500 focus:ring-blue-500/[.3] text-gray-900 dark:ring-offset-white dark:ring-white/0 dark:text-white"
					on:click={nonValidatedRate}
					{submitted}
					type="button"
				>
					Non-Validated Rate
				</SubmitButton>
				<SubmitButton {submitted}>Validated Rate</SubmitButton>
			</div>
		</Form>
	</div>
</Main>

<Modal bind:show={modal.candidate.show}>
	<div class="p-[1.5rem]">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
				.candidate.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<div class="flex items-center justify-between">
				<H6>Candidates</H6>
				<Button
					class="bg-transparent hover:bg-black/5 focus:bg-black/5 focus:ring-black/30 px-[.5rem]"
					on:click={() => (modal.candidate.show = !modal.candidate.show)}
					><Icon src={XMark} /></Button
				>
			</div>
			<div class="flex flex-col space-y-[.5rem]">
				{#each modal.candidate.candidates as { AddressKeyFormat }}
					<div class="flex items-center space-x-[1rem]">
						<P class="flex-grow">{AddressKeyFormat.AddressLine}, {AddressKeyFormat.Region}</P>
						<Button on:click={() => chooseCandidate(AddressKeyFormat)}>Select</Button>
					</div>
				{/each}
			</div>
			<div class="flex justify-end">
				<Button on:click={() => (modal.candidate.show = !modal.candidate.show)}>Close</Button>
			</div>
		</Card>
	</div>
</Modal>

<Modal bind:show={modal.error.show}>
	<div class="p-[1.5rem]">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
				.error.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<div class="flex items-center justify-between">
				<H6>Error</H6>
				<Button
					class="bg-transparent hover:bg-black/5 focus:bg-black/5 focus:ring-black/30 px-[.5rem]"
					on:click={() => (modal.error.show = !modal.error.show)}><Icon src={XMark} /></Button
				>
			</div>
			<P class="overflow-auto">{modal.error.body}</P>
			<div class="flex justify-end">
				<Button
					class="bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/30"
					on:click={() => (modal.error.show = !modal.error.show)}>Close</Button
				>
			</div>
		</Card>
	</div>
</Modal>

<Modal bind:show={modal.progress.rates.show}>
	<div class="p-[1.5rem]">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
				.progress.rates.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<P class="overflow-auto">Getting rates...</P>
		</Card>
	</div>
</Modal>
<Modal bind:show={modal.progress.saveQuote.show}>
	<div class="p-[1.5rem]">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
				.progress.saveQuote.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<P class="overflow-auto">Saving quote...</P>
		</Card>
	</div>
</Modal>

<Modal bind:show={modal.progress.validation.show}>
	<div class="p-[1.5rem]">
		<Card
			class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
				.progress.validation.show
				? 'scale-[1]'
				: 'scale-[.95]'}"
		>
			<P class="overflow-auto">Validating Address...</P>
		</Card>
	</div>
</Modal>
