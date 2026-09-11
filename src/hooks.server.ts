import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, isValidSession } from '$lib/server/auth.server';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.isAdmin = await isValidSession(token);

	return resolve(event);
};
