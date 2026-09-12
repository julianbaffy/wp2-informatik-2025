import { randomUUID } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const VOTER_COOKIE = 'voter_id';
const VOTER_MAX_AGE = 60 * 60 * 24 * 365; // 1 Jahr

/**
 * Liest die anonyme Voter-ID aus dem Cookie oder legt beim ersten Aufruf
 * eine neue an. Damit kann serverseitig geprüft werden, ob ein Browser
 * für eine bestimmte Seite schon abgestimmt hat.
 */
export function getOrCreateVoterId(cookies: Cookies): string {
	let voterId = cookies.get(VOTER_COOKIE);
	if (!voterId) {
		voterId = randomUUID();
		cookies.set(VOTER_COOKIE, voterId, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: VOTER_MAX_AGE
		});
	}
	return voterId;
}
