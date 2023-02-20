import * as db from '$db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  // get all routes
  const routes = await db.find({ collection: 'routes', query: {} });

  return { routes };
}) satisfies PageServerLoad;
