import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const rootHandle = (async ({ event, resolve }) => {
	// check if route is root
	if (event.url.pathname === '/') {
		return Response.redirect(`${event.url.origin}/sign-in`, 301);
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;

export const handle = sequence(rootHandle);
