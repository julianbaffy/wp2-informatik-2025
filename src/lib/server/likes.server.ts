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
 * Schaltet den Like für eine Seite um: noch nicht abgestimmt -> Like setzen
 * (+1), schon abgestimmt -> Like entfernen (-1). Der Check "schon
 * abgestimmt?" und die anschließende Schreiboperation laufen nicht in
 * einer einzigen atomaren Transaktion (Upstash REST hat dafür keine
 * einfache Lösung ohne Lua-Skript) – bei einem manuellen Button-Klick
 * mit clientseitiger Sperre während der Anfrage ist das Risiko einer
 * echten Kollision aber vernachlässigbar.
 */
export async function toggleVote(
	id: string,
	courseID: string,
	voterId: string
): Promise<LikeInfo> {
	const epoch = Number((await redis.get<number>(epochKey(id))) ?? 0);
	const key = votedKey(id, epoch, voterId);
	const alreadyVoted = await redis.get(key);

	const pipeline = redis.pipeline();

	if (alreadyVoted !== null) {
		// Like entfernen
		pipeline.del(key);
		pipeline.decr(countKey(id));
		const results = await pipeline.exec<[number, number]>();
		const newCount = Math.max(0, results[1]);
		return { count: newCount, voted: false };
	}

	// Like setzen
	pipeline.set(key, '1');
	pipeline.incr(countKey(id));
	pipeline.sadd(coursePagesKey(courseID), id);
	const results = await pipeline.exec<['OK', number, number]>();
	return { count: results[1], voted: true };
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
 * Setzt die Zähler der übergebenen IDs zurück und erlaubt allen
 * Nutzer*innen wieder eine neue Abstimmung (durch Erhöhen der Epoche pro
 * Seite). Die IDs werden vom Aufrufer übergeben (z. B. nur die Spiele
 * oder nur die Websites eines Kurses), damit beide Projekttypen
 * unabhängig voneinander zurückgesetzt werden können.
 */
export async function resetPages(ids: string[]): Promise<void> {
	if (ids.length === 0) return;

	const pipeline = redis.pipeline();
	for (const id of ids) {
		pipeline.incr(epochKey(id));
		pipeline.set(countKey(id), 0);
	}
	await pipeline.exec();
}
