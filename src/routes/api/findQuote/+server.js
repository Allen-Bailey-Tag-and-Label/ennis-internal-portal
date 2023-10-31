// imports
import { connect } from '@lib/mongodb';

export const GET = async () => {
	// await mongodb client
	const client = await connect();

	// find documents
	const docs = await client
		.db('production')
		.collection('ups-quotes')
		.find()
		.sort({ quote: -1 })
		.toArray();

	// close client
	client.close();

	// return new Response(docs);
	return new Response(JSON.stringify(docs));
};
