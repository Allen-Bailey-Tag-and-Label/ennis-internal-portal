import { ObjectId } from 'mongodb';
import * as db from '$db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }: { params: { _id: string } }) => {
  // find doc
  const doc = await db.findOne({
    collection: 'label-matrix',
    query: { _id: new ObjectId(params._id) }
  });

  return {
    doc
  };
}) satisfies PageServerLoad;
