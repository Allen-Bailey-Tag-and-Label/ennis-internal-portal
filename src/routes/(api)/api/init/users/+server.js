import crypto from 'crypto-js';
import { ObjectId } from 'mongodb';
import * as db from '$db';
import { JWT_SECRET } from '$env/static/private';
import { date as dateFormat } from '$lib/format';
import users from './users.json';

export const POST = async ({ request }) => {
  // get request data
  const { secret } = await request.json();

  // check if secret does not match
  if (secret !== JWT_SECRET) return new Response('', { status: 401 });

  // delete all users in db
  await db.deleteMany({ collection: 'users', query: {} });

  // find base user role
  const { _id: _roleId } = await db.findOne({ collection: 'roles', query: { name: 'User' } });

  // add users to db
  await Promise.all(
    users.map(async (user) => {
      // initiate initial password
      const initialPassword = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, '0');

      // initiate doc
      const doc = {
        _id: new ObjectId(user._id.$oid),
        ennisId: user?.ennisId,
        email: user?.email,
        extension: user?.extension,
        firstName: user?.firstName,
        hireDate: dateFormat(new Date(+user?.hireDate)),
        initialPassword,
        lastName: user?.lastName,
        password: JSON.stringify(crypto.SHA256(initialPassword).words),
        roles: [_roleId],
        isActive: user?.status === 'Active',
        username: user?.username,
        exempt: user?.exempt,
        redirectSignIn: user?.on?.signin || '/dashboard'
      };

      // add to db
      await db.insertOne({ collection: 'users', doc });
    })
  );

  return new Response();
};
