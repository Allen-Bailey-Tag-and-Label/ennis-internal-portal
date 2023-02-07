import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import * as db from '$db';
import { JWT_SECRET } from '$env/static/private';

export const verifyAuthToken: Handle = async ({ event }) => {
  // get authToken cookie
  let authToken = event.cookies.get('authToken');

  // decode authToken
  const { username } = jwt.verify(authToken, JWT_SECRET);

  // find user in database
  const user = await db.findOne({ collection: 'users', query: { username } });

  // check if no username found
  if (user === undefined) throw 'User not in database';

  // delete password from user
  delete user.password;

  // generate authToken
  authToken = jwt.sign(user, JWT_SECRET);

  // set auth cookie token
  event.cookies.set('authToken', authToken, {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });

  return user;
};
