import { connect } from '$lib/db';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';
const { ObjectId } = mongodb;
import authenticateUser from '../auth/get/_userId';

export async function del({ params, query }) {
  // connect to db
  const client = await connect();

  // get collection (slug)
  const { slug: collection } = params;

  // sanitize query
  query = Object.fromEntries(query);
  if ( 'date' in query ) query.date = +query.date;
  if ('_id' in query) query._id = ObjectId(query._id);
  if ('userId' in query) query.userId = ObjectId(query.userId);

  // delete doc
  await client.db().collection(collection).findOneAndDelete(query);

  return {
    status: 200,
    body: {},
  };
}

export async function get({ params, query }) {
  // connect to db
  const client = await connect();

  // get collection (slug)
  const { slug: collection } = params;

  // initialize sort
  let sort = {};

  // sanitize query
  query = Object.fromEntries(query);
  if ( 'date' in query ) query.date = +query.date;
  if ('_id' in query) query._id = ObjectId(query._id);
  if ('userId' in query) query.userId = ObjectId(query.userId);
  if ('sort' in query) {
    sort = JSON.parse(query.sort);
    delete query.sort;
  }
  
  // check for auth
  if ('auth' in query) query = await authenticateUser(query);

  // find rows
  let rows = await client
    .db()
    .collection(collection)
    .find(query)
    .collation({ locale: 'en' })
    .sort(sort)
    .toArray();

  // users case
  if (collection === 'users')
    rows = rows.map(row => {
      delete row.password;
      return row;
    });

  return {
    status: 200,
    body: {
      rows,
    },
  };
}

export async function patch({ body, params, query }) {
  // connect to db
  const client = await connect();

  // get collection (slug)
  const { slug: collection } = params;
  
  // sanitize body
  if ( 'date' in body ) body.date = +body.date;
  if ('_id' in body) body._id = ObjectId(body._id);
  if ('userId' in body) body.userId = ObjectId(body.userId);

  // sanitize query
  query = Object.fromEntries(query);
  if ( 'date' in query ) query.date = +query.date;
  if ('_id' in query) query._id = ObjectId(query._id);
  if ('userId' in query) query.userId = ObjectId(query.userId);

  // find and update doc
  const doc = await client
    .db()
    .collection(collection)
    .findOneAndUpdate(query, { $set: body }, { returnOriginal: false });

  return {
    status: 200,
    body: doc.value,
  };
}

export async function post({ body, params }) {
  // connect to db
  const client = await connect();

  // get collection (slug)
  const { slug: collection } = params;

  // check for auth
  if ('auth' in body) body = await authenticateUser(body);
  
  // sanitize body
  if ( 'date' in body ) body.date = +body.date;
  if ('_id' in body) body._id = ObjectId(body._id);
  if ('userId' in body) body.userId = ObjectId(body.userId);

  // insert into database
  const doc = await client.db().collection(collection).insertOne(body);

  return {
    status: 200,
    body: doc.ops[0]
  };
}
