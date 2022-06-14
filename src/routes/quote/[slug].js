// imports
import { connect } from '@lib/mongodb';

export async function get({ params }) {
  // await mongodb connection
  const connection = await connect();

  // destructure params
  const { slug: quote } = params;

  // find doc
  const doc = await connection
    .db()
    .collection('ups-quotes')
    .findOne({ quote: +quote });

  return { status: 200, body: doc };
}
