import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

// Upstash REST-Client: funktioniert per HTTPS ohne dauerhafte Verbindung
// und passt damit gut zu Vercel Functions (keine Connection-Pool-Probleme).
export const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL ?? '',
	token: env.UPSTASH_REDIS_REST_TOKEN ?? ''
});
