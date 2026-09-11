import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SESSION_COOKIE, destroySession } from '$lib/server/auth.server';

export const prerender = false;

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(SESSION_COOKIE);
	await destroySession(token);
	cookies.delete(SESSION_COOKIE, { path: '/' });

	throw redirect(303, '/admin/login');
};
