import { redirect } from '@sveltejs/kit';
import * as db from '$db';
import { formDataToObject } from '$lib/format';
import type { Actions } from './$types';

export const actions = {
  new: async ({ request }) => {
    // get request data
    const formData = await request.formData();
    const { height, name, width } = formDataToObject(formData);

    // initialize date
    const date = new Date();

    // create insert object
    const insert = {
      createdAt: date,
      height: +height,
      name,
      modifiedAt: date,
      versions: [
        {
          createdAt: date,
          height: +height,
          items: [],
          scale: 100,
          width: +width
        }
      ],
      width: +width
    };

    // insert new label into database
    const doc = await db.insertOne({ collection: 'label-matrix', doc: insert });

    throw redirect(303, `/label-matrix/view-edit/${doc._id}`);
  }
} satisfies Actions;
