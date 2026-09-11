import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { verifyAdminPassword, createAdminSession, SESSION_COOKIE } from '$lib/server/auth.server';

export const prerender = false;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.isAdmin) {
		throw redirect(303, '/admin');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (typeof password !== 'string' || password.length === 0) {
			return fail(400, { error: 'Bitte Passwort eingeben.' });
		}

		if (!verifyAdminPassword(password)) {
			return fail(401, { error: 'Falsches Passwort.' });
		}

		const { token, maxAge } = await createAdminSession();
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge
		});

		throw redirect(303, '/admin');
	}
};
