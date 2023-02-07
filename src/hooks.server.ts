import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { verifyAuthToken } from '$auth';
import * as db from '$db';

const protectedRoutesHandle: Handle = async ({ event, resolve }) => {
  // find all available roles and routes in db
  const [roles, routes] = await Promise.all(
    ['roles', 'routes'].map(async (collection) => await db.find({ collection, query: {} }))
  );

  // map to just the route name
  const pathNames = [...routes].map(({ route }) => route);

  // check if route is protected
  if (pathNames.includes(event.url.pathname)) {
    try {
      // verify authToken
      const user = await verifyAuthToken({ event });

      // set user locals
      event.locals.user = user;

      // get all user routes
      const userRoutes = [
        ...new Set(...roles.map((role: { routes: string[] }) => role.routes))
      ].map((_routeId) => routes.find((route: { _id: string }) => route._id === _routeId));

      // get user navigation
      let navigation = userRoutes.reduce((obj, route) => {
        // check if group is in obj
        if (!(route?.group in obj)) obj[route?.group] = [];

        // add route to group
        obj[route?.group] = [...obj[route?.group], { name: route.name, route: route.route }];

        return obj;
      }, {});

      // sort user navigation
      navigation = Object.keys(navigation).reduce((obj, key) => {
        obj[key] = navigation[key].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        return obj;
      }, {});

      // update user local navigation
      event.locals.user.navigation = navigation;
    } catch (error) {
      console.log({ error });

      // delete authToken cookie
      event.cookies.set('authToken', '', {
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: -3600
      });

      // redirect to sign-in route if invalid authToken
      return Response.redirect(`${event.url.origin}/sign-in`, 301);
    }
  }

  const response = await resolve(event);

  return response;
};

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

export const handle = sequence(rootRouteHandle, protectedRoutesHandle);
// export const handle = sequence(rootRouteHandle);
