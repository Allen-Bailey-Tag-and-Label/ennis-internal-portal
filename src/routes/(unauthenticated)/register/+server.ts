import type { RequestHandler } from './$types';

export const GET = (async ({ url: { searchParams } }) => {
	return new Response();
}) satisfies RequestHandler;
