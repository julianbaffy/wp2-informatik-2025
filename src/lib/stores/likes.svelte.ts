import { onMount } from 'svelte';

export type LikeInfo = { count: number; voted: boolean };
type HeartsVisible = { games: Set<string>; websites: Set<string> };
type LikesResponse = {
	likes: Record<string, LikeInfo>;
	heartsVisible: { games: string[]; websites: string[] };
};

let data = $state<Record<string, LikeInfo>>({});
// Vor dem ersten erfolgreichen Poll sind beide Sets leer -> Herzen bleiben
// ausgeblendet, statt kurz aufzublitzen und dann wieder zu verschwinden.
let heartsVisible = $state<HeartsVisible>({ games: new Set(), websites: new Set() });

async function fetchAll(): Promise<void> {
	try {
		const res = await fetch('/api/likes');
		if (!res.ok) return;
		const fresh = (await res.json()) as LikesResponse;
		data = fresh.likes;
		heartsVisible = {
			games: new Set(fresh.heartsVisible.games),
			websites: new Set(fresh.heartsVisible.websites)
		};
	} catch {
		// Netzwerkfehler: der nächste Poll versucht es einfach erneut.
	}
}

/**
 * Startet das Laden + regelmäßige Nachladen der Like-Zähler.
 * Einmal pro Seite aufrufen (z. B. in +page.svelte), nicht pro Komponente,
 * damit nicht mehrere Grids/Tabs gleichzeitig eigene Intervalle starten.
 */
export function useLikePolling(intervalMs = 7000): void {
	onMount(() => {
		fetchAll();
		const timer = setInterval(fetchAll, intervalMs);
		return () => clearInterval(timer);
	});
}

/** Aktueller Stand für eine einzelne ID (reaktiv lesbar aus jeder Komponente). */
export function likeInfo(id: string): LikeInfo {
	return data[id] ?? { count: 0, voted: false };
}

/**
 * Ob für einen Kurs (getrennt nach Projekttyp) die Herzen angezeigt werden
 * sollen. Wird im Admin-Bereich unter /admin/likes pro Kurs umgeschaltet.
 */
export function showHeartsFor(courseID: string, type: 'games' | 'websites'): boolean {
	return heartsVisible[type].has(courseID);
}

/**
 * Schaltet den Like einer Seite um. Die Änderung wird sofort clientseitig
 * angezeigt (optimistic update); schlägt der Request fehl, wird der vorige
 * Stand wiederhergestellt.
 */
export async function toggleLike(id: string, courseID: string): Promise<void> {
	const previous = likeInfo(id);
	const optimistic: LikeInfo = previous.voted
		? { count: Math.max(0, previous.count - 1), voted: false }
		: { count: previous.count + 1, voted: true };

	data = { ...data, [id]: optimistic };

	try {
		const res = await fetch('/api/likes', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id, courseID })
		});

		if (!res.ok) {
			data = { ...data, [id]: previous };
			return;
		}

		const result = (await res.json()) as LikeInfo;
		data = { ...data, [id]: result };
	} catch {
		data = { ...data, [id]: previous };
	}
}
