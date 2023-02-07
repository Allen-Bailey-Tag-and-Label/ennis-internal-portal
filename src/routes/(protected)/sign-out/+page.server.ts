import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ cookies }) => {
    // remove auth token
    cookies.set('authToken', '', {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1
    });

    // redirect to sign-in route
    throw redirect(301, '/sign-in');
  }
} satisfies Actions;
