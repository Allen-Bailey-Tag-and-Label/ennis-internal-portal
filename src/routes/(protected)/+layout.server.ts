import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
  // get user from locals
  const { user } = locals;

  return {
    user
  };
}) satisfies LayoutServerLoad;
