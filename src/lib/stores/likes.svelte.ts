import { onMount } from 'svelte';

export type LikeInfo = { count: number; voted: boolean };

let data = $state<Record<string, LikeInfo>>({});

async function fetchAll(): Promise<void> {
	try {
		const res = await fetch('/api/likes');
		if (!res.ok) return;
		const fresh = (await res.json()) as Record<string, LikeInfo>;
		data = fresh;
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

/** Registriert einen Like-Klick und aktualisiert den lokalen Stand sofort. */
export async function vote(id: string, courseID: string): Promise<void> {
	try {
		const res = await fetch('/api/likes', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id, courseID })
		});
		if (!res.ok) return;
		const result = (await res.json()) as LikeInfo;
		data = { ...data, [id]: result };
	} catch {
		// Netzwerkfehler: der nächste periodische Poll gleicht wieder ab.
	}
}
