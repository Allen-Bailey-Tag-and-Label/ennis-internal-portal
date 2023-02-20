import * as db from '$db';

export const load = async () => {
  // get all users
  const [users] = await Promise.all(
    ['users'].map(async (collection) => await db.find({ collection, query: {} }))
  );

  return { users };
};
