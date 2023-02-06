import crypto from 'crypto-js';
import * as db from '$db';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

type DefaultRoute = {
  group?: string;
  name: string;
  route: string;
};
type User = {
  firstName: string;
  lastName: string;
  ennisId: string;
  hiredAt: string;
  title: string;
  email: string;
  extension: string;
  username: string;
  password: string;
  roles: string[];
};

const defaultRoutes: DefaultRoute[] = [
  { name: 'Dashboard', route: '/dashboard' },
  { group: 'Admin', name: 'Routes', route: '/admin/routes' },
  { group: 'Admin', name: 'Roles', route: '/admin/roles' }
];

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const user: User = Object.fromEntries(await request.formData());

    // create default routes
    const routes = await Promise.all(
      defaultRoutes.map(async (doc) => {
        const { _id } = await db.insertOne({ collection: 'routes', doc });
        return _id;
      })
    );

    // create default admin role
    const { _id: _adminRoleId } = await db.insertOne({
      collection: 'roles',
      doc: { name: 'Admin', routes }
    });

    // hash password
    user.password = JSON.stringify(crypto.SHA256(user.password).words);

    // add roles
    user.roles = [_adminRoleId];

    // create user
    await db.insertOne({ collection: 'users', doc: user });

    return { success: true };
  }
} satisfies Actions;
