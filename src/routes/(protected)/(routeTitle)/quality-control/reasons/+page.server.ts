import * as db from '$db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  // get all qcReasons
  const qcReasons = await db.find({ collection: 'quality-control-reasons', query: {} });

  return { qcReasons };
}) satisfies PageServerLoad;
