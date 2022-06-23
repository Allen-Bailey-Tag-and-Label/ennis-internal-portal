// imports
import { connect } from '@lib/mongodb';

export async function get() {
  // await mongodb connection
  const connection = await connect();

  // find documents
  const docs = await connection.db().collection('ups-quotes').find().sort({ quote: -1 }).toArray();

  return { status: 200, body: docs };
}

export async function post({ request }) {
  // await mongodb connection
  const connection = await connect();

  // destructure request
  const {
    classification,
    dateFrom,
    dateTo,
    quote,
    shipTo: { AddressLine, City, StateProvinceCode, PostalCode }
  } = await request.json();

  // initiate query
  const query = {};

  // update query values
  if (classification !== '') query.classification = classification;
  if (quote !== '') query.quote = +quote;
  if (dateFrom !== '' || dateTo !== '') {
    if (dateTo === '')
      query.date = {
        $gte: new Date(dateFrom),
        $lt: new Date(new Date(dateFrom).setDate(new Date(dateFrom).getDate() + 1))
      };
    if (dateFrom === '')
      query.date = {
        $gte: new Date(dateTo),
        $lt: new Date(new Date(dateTo).setDate(new Date(dateTo).getDate() + 1))
      };
    if (dateFrom !== '' && dateTo !== '')
      query.date = {
        $gte: new Date(dateFrom),
        $lt: new Date(new Date(dateTo).setDate(new Date(dateTo).getDate() + 1))
      };
  }
  if (AddressLine !== '') query['shipTo.AddressLine'] = { $regex: new RegExp(AddressLine, 'i') };
  if (City !== '') query['shipTo.City'] = { $regex: new RegExp(City, 'i') };
  if (StateProvinceCode !== '')
    query['shipTo.StateProvinceCode'] = { $regex: new RegExp(StateProvinceCode, 'i') };
  if (PostalCode !== '') query['shipTo.PostalCode'] = { $regex: new RegExp(PostalCode, 'i') };

  // find document
  const docs = await connection
    .db()
    .collection('ups-quotes')
    .find(query)
    .sort({ quote: -1 })
    .toArray();

  return { status: 200, body: docs };
}
