import * as db from '$db';
import * as format from '$lib/format';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { das } = Object.fromEntries(await request.formData());

    // get headers and docs
    let [headers, ...docs] = das.replace(/\n$/, '').split('\n');

    // const format functions
    const formats = {
      currency: (v: string) => parseFloat(v.replace(/[^\d|.]/g, '')),
      date: (v: string) => {
        const date = v.split('/');
        if (date.length !== 3) return v;
        return format.date(new Date(+date[2], +date[0] - 1, +date[1]));
      },
      float: (v: string) => parseFloat(v.replace(/[^\d|.]/g, '')),
      int: (v: string) => +v.replace(/[^\d|.]/g, ''),
      string: (v: string) => v
    };

    // common header formats
    const headerFormats: { [key: string]: any } = {
      'hold-code': formats.string,
      'payment-terms-code': formats.string,
      'order-number': formats.int,
      'order-type': formats.string,
      'quote-number': formats.int,
      'wo-number': formats.int,
      'doc-co': formats.int,
      'line-number': formats.float,
      'sold-to': formats.int,
      'sold-to-name': formats.string,
      '2nd-item-number': formats.string,
      'description-1': formats.string,
      quantity: formats.int,
      uom: formats.string,
      'unit-price': formats.float,
      'extended-amount': formats.float,
      'line-type': formats.string,
      'order-date': formats.date,
      'original-date': formats.date,
      'reschedule-date': formats.date,
      'actual-ship-date': formats.date,
      'transaction-originator': formats.string,
      'customer-po': formats.string,
      'invoice-number': formats.int,
      'ecommerce-id': formats.string,
      'last-status': formats.int
    };

    // parse and sanitize headers
    headers = headers
      .trim()
      .split('\t')
      .map((header: string) => header.trim().toLowerCase().replace(/\s/g, '-'));

    // parse all lines
    docs = docs
      .map((doc: { [key: string]: any }) => {
        return {
          ...doc.split('\t').reduce((obj: { [key: string]: any }, value: string, i: number) => {
            obj[headers[i]] = headerFormats[headers[i]](value.trim());
            return obj;
          }, {})
        };
      })
      .filter(
        (doc: { 'line-type': string }) => doc['line-type'] !== 'T' && doc['line-type'] !== 'TT'
      );

    // create docs in db
    await Promise.all(
      docs.map(async (doc: { 'order-number': number; 'line-number': number }, i: number) => {
        await db.findOneAndUpdate({
          collection: 'orders',
          query: { 'order-number': doc['order-number'], 'line-number': doc['line-number'] },
          update: { $set: { ...doc } }
        });
        console.log(`doc ${i + 1} of ${docs.length} sent`);
      })
    );

    return {};
  }
} satisfies Actions;
