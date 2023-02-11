import crypto from 'crypto-js';
import { ObjectId } from 'mongodb';
import * as db from '$db';
import { JWT_SECRET } from '$env/static/private';
import { date as dateFormat } from '$lib/format';
import pcrs from './pay-change-requests.json';

export const POST = async ({ request }) => {
  // get request data
  const { secret } = await request.json();

  // check if secret does not match
  if (secret !== JWT_SECRET) return new Response('', { status: 401 });

  // delete all pay-change-requests in db
  await db.deleteMany({ collection: 'pay-change-requests', query: {} });

  // add all pcrs to db
  await Promise.all(
    pcrs.map(async (obj) => {
      const pcr = {
        _id: new ObjectId(obj._id.$oid),
        _userId: new ObjectId(obj.userId.$oid),
        after: obj.change.after,
        code: obj.change.code,
        costCenter: obj.costCenter,
        date: dateFormat(new Date(obj.change.date)),
        description: obj.change.description,
        eeoClassification: obj.eeoClassification,
        exempt: obj.change.exempt,
        explanation: obj.change.explanation,
        jobCode: obj.jobCode,
        jobTitle: obj.jobTitle,
        previous: obj.change.previous,
        percent: obj.change.percent,
        workCompClass: obj.workCompClass
      };

      // add to db
      await db.insertOne({ collection: 'pay-change-requests', doc: pcr });
    })
  );

  return new Response();
};
