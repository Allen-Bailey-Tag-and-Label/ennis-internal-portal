import { MongoClient } from 'mongodb';
import { MONGO_DB, MONGO_MAX_POOL_SIZE, MONGO_PASSWORD, MONGO_URI } from '$env/static/private';
import { object } from 'webidl-conversions';

const client = new MongoClient(
  MONGO_URI.replace('?retryWrites', `${MONGO_DB}?retryWrites`).replace(
    '<password>',
    MONGO_PASSWORD
  ),
  {
    maxPoolSize: +MONGO_MAX_POOL_SIZE,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
let connection: MongoClient | undefined;

const connect = async () => {
  if (connection === undefined) connection = await client.connect();
};

const deleteMany = async ({ collection, query = {} }: { collection: string; query: object }) => {
  // await connection
  await connect();

  // delete docs
  await client.db().collection(collection).deleteMany(query);
};

const find = async ({ collection, query }: { collection: string; query: {} }) => {
  // await connection
  await connect();

  // find documents
  const docs = await client.db().collection(collection).find(query).toArray();

  return JSON.parse(JSON.stringify(docs));
};

const findOne = async ({ collection, query }: { collection: string; query: {} }) => {
  // await connection
  await connect();

  // find document
  const doc = await client.db().collection(collection).findOne(query);

  return JSON.parse(JSON.stringify(doc));
};

const findOneAndUpdate = async ({
  collection,
  query,
  update
}: {
  collection: string;
  query: object;
  update: object;
}) => {
  // await connection
  await connect();

  // find document and update
  const doc = await client
    .db()
    .collection(collection)
    .findOneAndUpdate(query, update, { upsert: true, returnDocument: 'after' });

  return JSON.parse(JSON.stringify(doc));
};

const insertOne = async ({ collection, doc }: { collection: string; doc: object }) => {
  // await connection
  await connect();

  // create doc
  const { value: createdDoc } = await client
    .db()
    .collection(collection)
    .findOneAndUpdate(doc, { $set: {} }, { upsert: true, returnDocument: 'after' });

  return JSON.parse(JSON.stringify(createdDoc));
};

const updateMany = async ({
  collection,
  query,
  update
}: {
  collection: string;
  query: object;
  update: object;
}) => {
  // await connection
  await connect();

  await client.db().collection(collection).updateMany(query, update);
};

export { deleteMany, find, findOne, findOneAndUpdate, insertOne, updateMany };
