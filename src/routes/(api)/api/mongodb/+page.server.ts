import { ObjectId } from 'mongodb';
import * as db from '$db';
import type { Actions } from './$types';

const updateArrayIdKeys = (array) =>
  array.map((item) => {
    // check if item is object
    if (typeof item === 'object' && !Array.isArray(item) && item !== null)
      item = updateObjectIdKeys(item);

    // check if value is array
    if (Array.isArray(item)) item = updateArrayIdKeys(item);

    return item;
  });
const updateObjectIdKeys = (obj) =>
  Object.keys(obj).reduce((reduceObj: { [key: string]: any }, key) => {
    // get current key value
    const value = obj[key];

    // check if value is object
    if (typeof value === 'object' && !Array.isArray(value) && value !== null)
      reduceObj[key] = updateObjectIdKeys(value);

    // check if value is array
    if (Array.isArray(value)) reduceObj[key] = updateArrayIdKeys(value);

    // check if value is string
    if (typeof value === 'boolean' || typeof value === 'string')
      reduceObj[key] = key.charAt(0) === '_' ? new ObjectId(obj[key]) : obj[key];

    return reduceObj;
  }, {});

export const actions = {
  create: async ({ request }) => {
    // get submitted data
    let { collection, doc } = Object.fromEntries(await request.formData());

    // convert doc string to object
    doc = JSON.parse(doc);

    // add _id to doc
    doc._id = new ObjectId();

    // create doc in db
    const insertedDoc = await db.insertOne({ collection, doc });

    return { insertedDoc, success: true };
  },
  delete: async ({ request }) => {
    // get submitted data
    let { collection, query } = Object.fromEntries(await request.formData());

    // parse query
    query = JSON.parse(query);

    // find all keys starting with _ and convert to ObjectId
    query = updateObjectIdKeys(query);

    // delete db
    await db.deleteMany({ collection, query });

    return { success: true };
  },
  update: async ({ request }) => {
    // get submitted data
    let { collection, query, update } = Object.fromEntries(await request.formData());

    // parse query and update
    query = JSON.parse(query);
    update = JSON.parse(update);

    // find all keys starting with _ and convert to ObjectId
    query = updateObjectIdKeys(query);
    update = updateObjectIdKeys(update);

    // update db
    await db.findOneAndUpdate({ collection, query, update });

    return { success: true };
  }
} satisfies Actions;
