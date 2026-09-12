import { redis } from './redis';

const countKey = (id: string) => `page:${id}:count`;
const epochKey = (id: string) => `page:${id}:epoch`;
const votedKey = (id: string, epoch: number, voterId: string) =>
	`page:${id}:epoch:${epoch}:voted:${voterId}`;
const coursePagesKey = (courseID: string) => `course:${courseID}:pages`;

export type LikeInfo = { count: number; voted: boolean };

/**
 * Liest Zähler + "schon abgestimmt"-Status für mehrere IDs auf einmal
 * (2 Redis-Roundtrips insgesamt, unabhängig von der Anzahl der IDs).
 */
export async function getLikeInfoForIds(
	ids: string[],
	voterId: string
): Promise<Record<string, LikeInfo>> {
	if (ids.length === 0) return {};

	// 1. Roundtrip: Zähler + Epoche für alle IDs gemeinsam abfragen
	const combinedKeys = ids.flatMap((id) => [countKey(id), epochKey(id)]);
	const combinedValues = await redis.mget<(number | null)[]>(...combinedKeys);

	const epochs: Record<string, number> = {};
	const counts: Record<string, number> = {};
	ids.forEach((id, i) => {
		counts[id] = Number(combinedValues[i * 2] ?? 0);
		epochs[id] = Number(combinedValues[i * 2 + 1] ?? 0);
	});

	// 2. Roundtrip: pro ID prüfen, ob diese*r Voter*in in der aktuellen Epoche
	// schon abgestimmt hat (Reset erhöht die Epoche -> alte "voted"-Einträge
	// werden dadurch automatisch ungültig, ohne dass wir sie löschen müssen).
	const voteCheckKeys = ids.map((id) => votedKey(id, epochs[id], voterId));
	const voteCheckValues = await redis.mget<(string | null)[]>(...voteCheckKeys);

	const result: Record<string, LikeInfo> = {};
	ids.forEach((id, i) => {
		result[id] = { count: counts[id], voted: voteCheckValues[i] !== null };
	});
	return result;
}

/**
 * Registriert einen Like-Klick. Atomar über SET...NX: nur wer den
 * "voted"-Key als Erste*r setzen kann, erhöht den Zähler. So kann ein
 * Doppelklick oder ein zweiter, zeitgleicher Request nicht doppelt zählen.
 */
export async function registerVote(
	id: string,
	courseID: string,
	voterId: string
): Promise<LikeInfo> {
	const epoch = Number((await redis.get<number>(epochKey(id))) ?? 0);
	const key = votedKey(id, epoch, voterId);

	const firstTime = await redis.set(key, '1', { nx: true });

	if (firstTime) {
		await redis.sadd(coursePagesKey(courseID), id);
		const newCount = await redis.incr(countKey(id));
		return { count: newCount, voted: true };
	}

	const count = Number((await redis.get<number>(countKey(id))) ?? 0);
	return { count, voted: true };
}

/** Stellt sicher, dass alle IDs eines Kurses in dessen Redis-Set enthalten sind. */
export async function ensureCourseTracking(courseID: string, ids: string[]): Promise<void> {
	if (ids.length === 0) return;
	await redis.sadd(coursePagesKey(courseID), ids[0], ...ids.slice(1));
}

/** Zählerstände für eine Liste von IDs (z. B. für die Admin-Übersicht eines Kurses). */
export async function getCounts(ids: string[]): Promise<Record<string, number>> {
	if (ids.length === 0) return {};
	const values = await redis.mget<(number | null)[]>(...ids.map(countKey));
	const result: Record<string, number> = {};
	ids.forEach((id, i) => (result[id] = Number(values[i] ?? 0)));
	return result;
}

/**
 * Setzt alle Zähler eines Kurses zurück und erlaubt allen Nutzer*innen
 * wieder eine neue Abstimmung (durch Erhöhen der Epoche pro Seite).
 */
export async function resetCourse(courseID: string): Promise<void> {
	const ids = await redis.smembers(coursePagesKey(courseID));
	if (ids.length === 0) return;

	const pipeline = redis.pipeline();
	for (const id of ids) {
		pipeline.incr(epochKey(id));
		pipeline.set(countKey(id), 0);
	}
	await pipeline.exec();
}
