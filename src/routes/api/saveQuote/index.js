// imports
import { connect } from '@lib/mongodb';

export async function post({ request }) {
  // await mongodb connection
  connection = await connect();

  // destrucutre request
  const {
    classification,
    PackageInfo: packageInfo,
    rates,
    Shipper: shipper,
    ShipTo: shipTo
  } = await request.json();

  // find total current quotes
  const docs = await connection.db().collection('ups-quotes').find().toArray();

  // get next quote number
  const quote = docs.length + 4804534;

  // get current date
  const date = new Date();

  // generate doc
  const doc = { classification, date, packageInfo, quote, rates, shipper, shipTo };

  // insert document
  await connection.db().collection('ups-quotes').insertOne(doc);

  return { status: 200, body: doc };
}
