import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { redis } from './redis';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 Tage
const SESSION_KEY_PREFIX = 'session:';

/**
 * Vergleicht ein eingegebenes Passwort mit dem in ADMIN_PASSWORD_HASH
 * gespeicherten Hash (Format "salt:hash", beides hex-kodiert).
 * Erzeugt wird dieser Wert mit `npm run admin:hash-password`.
 */
export function verifyAdminPassword(password: string): boolean {
	const stored = env.ADMIN_PASSWORD_HASH;
	if (!stored) {
		console.error('ADMIN_PASSWORD_HASH ist nicht gesetzt.');
		return false;
	}

	const [salt, hashHex] = stored.split(':');
	if (!salt || !hashHex) {
		console.error('ADMIN_PASSWORD_HASH hat ein ungültiges Format.');
		return false;
	}

	const expected = Buffer.from(hashHex, 'hex');
	const actual = scryptSync(password, salt, expected.length);

	// timingSafeEqual verhindert Timing-Angriffe, braucht aber gleich lange Buffer.
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Legt eine neue Admin-Session in Redis an und gibt Token + Gültigkeitsdauer zurück. */
export async function createAdminSession(): Promise<{ token: string; maxAge: number }> {
	const token = randomBytes(32).toString('hex');
	await redis.set(`${SESSION_KEY_PREFIX}${token}`, '1', { ex: SESSION_TTL_SECONDS });
	return { token, maxAge: SESSION_TTL_SECONDS };
}

/** Prüft, ob ein Session-Token (noch) gültig ist. */
export async function isValidSession(token: string | undefined): Promise<boolean> {
	if (!token) return false;
	const value = await redis.get(`${SESSION_KEY_PREFIX}${token}`);
	return value !== null;
}

/** Beendet eine Admin-Session (Logout). */
export async function destroySession(token: string | undefined): Promise<void> {
	if (!token) return;
	await redis.del(`${SESSION_KEY_PREFIX}${token}`);
}
