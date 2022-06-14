// imports
import 'dotenv/config';
import { MongoClient } from 'mongodb';

// connection options
const options = { useUnifiedTopology: true, useNewUrlParser: true };

// create a new MongoClient
let client;

// initial connection variable
let connection;

// create connection function
const connect = async () => {
  if (client === undefined) client = new MongoClient(process.env.MONGODB_URL, options);
  if (connection === undefined) connection = await client.connect();
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
