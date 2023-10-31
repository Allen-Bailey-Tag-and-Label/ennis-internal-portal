<script>
	// imports
	import { pagination, quoteFilter, quotes } from '@stores';
	import { onMount } from 'svelte';

	// components
	import { Main, Pagination, QuotesFilters, QuotesTable } from '@components';

	// helpers
	const findQuotes = async () => {
		const response = await fetch('/api/findQuote');
		$quotes = await response.json();
	};
	const getFilteredResults = (arr) => {
		try {
			// destructure quoteFilter
			const { classification, dateFrom, dateTo, quote, shipTo } = $quoteFilter;

			// check if classification is not empty
			if (classification !== '') arr = arr.filter((elem) => elem.classification === classification);

			// check if quote is not empty
			if (quote !== '') arr = arr.filter((elem) => new RegExp(quote, 'g').test(elem.quote));

			// check if dateFrom is not empty
			if (dateFrom !== '') arr = arr.filter((elem) => new Date(elem.date) >= new Date(dateFrom));

			// check if dateTo is empty
			if (dateTo !== '')
				arr = arr.filter(
					(elem) =>
						new Date(elem.date) <=
						new Date(new Date(dateTo).setDate(new Date(dateTo).getDate() + 1))
				);

			// check if AddressLine is not empty
			if (shipTo.AddressLine !== '')
				arr = arr.filter((elem) =>
					new RegExp(shipTo.AddressLine, 'gi').test(elem.shipTo.AddressLine)
				);

			// check if City is not empty
			if (shipTo.City !== '')
				arr = arr.filter((elem) => new RegExp(shipTo.City, 'gi').test(elem.shipTo.City));

			// check if StateProvinceCode is not empty
			if (shipTo.StateProvinceCode !== '')
				arr = arr.filter((elem) =>
					new RegExp(shipTo.StateProvinceCode, 'gi').test(elem.shipTo.StateProvinceCode)
				);

			// check if PostalCode is not empty
			if (shipTo.PostalCode !== '')
				arr = arr.filter((elem) =>
					new RegExp(shipTo.PostalCode, 'gi').test(elem.shipTo.PostalCode)
				);
		} catch (error) {}

		return arr;
	};

	// props (internal)
	let filteredResults = [];

	// props (dynamic)
	$: if ($quoteFilter || $quotes) filteredResults = getFilteredResults($quotes);
	$: showingOptions =
		$pagination.number === 'All'
			? [{ label: `1 - ${filteredResults.length}` }]
			: [...Array(Math.ceil(filteredResults.length / +$pagination.number))].map((_, i) => {
					return {
						label: `${i * $pagination.number + 1} - ${Math.min(
							filteredResults.length,
							(i + 1) * $pagination.number
						)}`,
						value: i
					};
			  });
	$: paginatedResults =
		$pagination.number === 'All'
			? [...filteredResults]
			: [...filteredResults].slice(
					+$pagination.current * +$pagination.number,
					(+$pagination.current + 1) * +$pagination.number
			  );

	// lifecycle
	onMount(async () => await findQuotes());
</script>

<Main class="flex-grow overflow-auto">
	<div class="flex flex-col space-y-[2rem] flex-grow container mx-auto py-[2rem]">
		<QuotesFilters />
		<Pagination {filteredResults} {showingOptions} />
		<QuotesTable {paginatedResults} />
		<Pagination {filteredResults} {showingOptions} />
	</div>
</Main>
