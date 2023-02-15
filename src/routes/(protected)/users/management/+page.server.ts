import * as db from '$db';

export const load = async () => {
  // get all users
  const [roles, users] = await Promise.all(
    ['roles', 'users'].map(async (collection) => await db.find({ collection, query: {} }))
  );

  return { roles, users };
};
