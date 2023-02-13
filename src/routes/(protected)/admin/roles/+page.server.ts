import * as db from '$db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  // get all routes
  const [roles, routes] = await Promise.all(
    ['roles', 'routes'].map(async (collection) => await db.find({ collection, query: {} }))
  );

  return { roles, routes };
}) satisfies PageServerLoad;
