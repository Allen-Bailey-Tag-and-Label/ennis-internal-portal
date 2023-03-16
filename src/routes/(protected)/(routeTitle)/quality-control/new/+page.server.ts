import * as db from '$db';
import * as format from '$lib/format';
import type { Actions } from './$types';

export const actions = {
  'find-order': async ({ request }) => {
    // get submitted data
    const { orderNumber } = Object.fromEntries(await request.formData());

    // find users
    const [qcReasons, users] = await Promise.all(
      ['quality-control-reasons', 'users'].map(
        async (collection) => await db.find({ collection, query: {} })
      )
    );

    // find order lines
    const docs = await db.find({ collection: 'orders', query: { 'order-number': +orderNumber } });

    return {
      data: {
        _reason: '',
        _users: [{ _id: '' }],
        createdDate: format.date(new Date()),
        docs,
        invoiceNumber: docs?.[0]?.['invoice-number'],
        orderNumber,
        problem: '',
        qcReasons,
        soldTo: docs?.[0]?.['sold-to'],
        soldToName: docs?.[0]?.['sold-to-name'],
        users
      }
    };
  },
  submit: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    console.log(data);
    return {};
  }
} satisfies Actions;
