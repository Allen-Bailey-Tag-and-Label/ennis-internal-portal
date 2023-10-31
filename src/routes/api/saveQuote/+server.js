// imports
import { connect } from '@lib/mongodb';

export const POST = async ({ request }) => {
	// await mongodb client
	const client = await connect();

	// destrucutre request
	const {
		classification,
		PackageInfo: packageInfo,
		rates,
		Shipper: shipper,
		ShipTo: shipTo
	} = await request.json();

	// find total current quotes
	const docs = await client.db('production').collection('ups-quotes').find().toArray();

	// get next quote number
	const quote = docs.length + 4804534;

	// get current date
	const date = new Date();

	// generate doc
	const doc = { classification, date, packageInfo, quote, rates, shipper, shipTo };

	// insert document
	await client.db('production').collection('ups-quotes').insertOne(doc);

	client.close();

	return new Response(JSON.stringify(doc));
};
