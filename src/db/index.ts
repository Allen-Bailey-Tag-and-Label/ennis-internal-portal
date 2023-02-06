import { MongoClient } from 'mongodb';
import { MONGO_DB, MONGO_PASSWORD, MONGO_URI } from '$env/static/private';

const client = new MongoClient(
  MONGO_URI.replace('?retryWrites', `${MONGO_DB}?retryWrites`).replace('<password>', MONGO_PASSWORD)
);
let connection: MongoClient | undefined;

const connect = async () => {
  if (connection === undefined) connection = await client.connect();
};

type InsertProp = {
  collection: string;
  doc: object;
};

const insertOne = async ({ collection, doc }: InsertProp) => {
  // await connection
  await connect();

  // create doc
  const createdDoc = await client
    .db()
    .collection(collection)
    .findOneAndUpdate(doc, { $set: {} }, { upsert: true, returnDocument: 'after' });

  return JSON.parse(JSON.stringify(createdDoc));
};

type FindProp = {
  collection: string;
  query: {};
};

const find = async ({ collection, query }: FindProp) => {
  // await connection
  await connect();

  // find documents
  const docs = await client.db().collection(collection).find(query).toArray();

  return JSON.parse(JSON.stringify(docs));
};

const findOne = async ({ collection, query }: FindProp) => {
  // await connection
  await connect();

  // find document
  const doc = await client.db().collection(collection).findOne(query);

  return JSON.parse(JSON.stringify(doc));
};

type FindOneAndUpdateProp = {
  collection: string;
  query: object;
  update: object;
};

const findOneAndUpdate = async ({ collection, query, update }: FindOneAndUpdateProp) => {
  // await connection
  await connect();

  // find document and update
  const doc = await client
    .db()
    .collection(collection)
    .findOneAndUpdate(query, update, { upsert: true, returnDocument: 'after' });

  return JSON.parse(JSON.stringify(doc));
};

export { insertOne, find, findOne, findOneAndUpdate };
