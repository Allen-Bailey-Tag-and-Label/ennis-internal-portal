import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '$auth';
import * as db from '$db';
import { JWT_SECRET } from '$env/static/private';
import { protectedRoutes } from '$routes';

// const protectedRoutesHandle: Handle = async ({ event, resolve }) => {
//   // initialize protected routes
//   const routes = protectedRoutes.map(({ href }: { href: string }) => href);

//   // check if route is protected
//   if (routes.includes(event.url.pathname)) {
//     try {
//       // verify authToken
//       const user = await verifyAuthToken({ event });

//       // confirm user is active
//       if (!user.isActive) throw 'User is not active';

//       // set user locals
//       event.locals.user = user;
//     } catch (error) {
//       console.log({ error });

//       // delete authToken cookie
//       event.cookies.set('authToken', '', {
//         path: '/',
//         sameSite: 'strict',
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: -3600
//       });

//       // redirect to sign-in route if invalid authToken
//       return Response.redirect(`${event.url.origin}/sign-in`, 301);
//     }
//   }

//   const response = await resolve(event);

//   return response;
// };

const rootRouteHandle: Handle = async ({ event, resolve }) => {
  // get authToken cookie
  let authToken = event.cookies.get('authToken');

  // check if route is root
  if (event.url.pathname === '/') {
    // redirect to sign-in route if authToken is undefined
    if (authToken === undefined) return Response.redirect(`${event.url.origin}/sign-in`, 301);
    try {
      // verify authToken
      const user = await verifyAuthToken({ event });

      // set user locals
      event.locals.user = user;

      // redirect to dashboard
      return Response.redirect(`${event.url.origin}${user.redirectSignIn}`, 301);
    } catch (error) {
      console.log({ error });

      // redirect to sign-in route if invalid authToken
      return Response.redirect(`${event.url.origin}/sign-in`, 301);
    }
  }

  const response = await resolve(event);

  return response;
};

// export const handle = sequence(rootRouteHandle, protectedRoutesHandle);
export const handle = sequence(rootRouteHandle);
