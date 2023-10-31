// imports
import { connect } from '@lib/mongodb';

export const load = async ({ params }) => {
	// await mongodb client
	const client = await connect();

	// destructure params
	const { slug: quote } = params;

	// find doc
	const doc = await client
		.db('production')
		.collection('ups-quotes')
		.findOne({ quote: +quote });

	client.close();

	return JSON.parse(JSON.stringify(doc));
};
