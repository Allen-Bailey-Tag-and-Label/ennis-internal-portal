// imports
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { MONGODB_URL } from '$env/static/private';

// connection options
const options = { useUnifiedTopology: true, useNewUrlParser: true };

// create connection function
const connect = async () => {
	const client = new MongoClient(MONGODB_URL, options);
	await client.connect();
	return client;
};

// close connection
const close = async () => client.close();

// populate method
const populate = async ({ _id, collection = undefined, docs = undefined }) => {
	// check if collection is not undefined
	if (collection !== undefined) docs = await client.db().collection(collection).find().toArray();

	// check if docs is not undefined
	if (docs !== undefined) return docs.find((obj) => obj._id.toString() === _id.toString());

	return undefined;
};

export { close, connect, populate };
