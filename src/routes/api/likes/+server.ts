import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLikeInfoForIds, toggleVote } from '$lib/server/likes.server';
import { getOrCreateVoterId } from '$lib/server/voter.server';
import gameLinksData from '$lib/generated/games/games.json';
import websiteLinksData from '$lib/generated/websites/links.json';
import type { GameLink, WebsiteLink } from '$lib/types/customTypes';

export const prerender = false;

function allIds(): string[] {
	const gameIds = (gameLinksData as GameLink[]).map((g) => g.id);
	const websiteIds = (websiteLinksData as WebsiteLink[]).map((w) => w.id);
	return [...new Set([...gameIds, ...websiteIds])];
}

/** Liefert Zähler + "schon abgestimmt"-Status für alle Spiele/Websites in einem Rutsch. */
export const GET: RequestHandler = async ({ cookies }) => {
	const voterId = getOrCreateVoterId(cookies);
	const result = await getLikeInfoForIds(allIds(), voterId);
	return json(result);
};

/** Schaltet den Like für eine einzelne Seite um (setzen oder entfernen). */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const voterId = getOrCreateVoterId(cookies);
	const body = await request.json().catch(() => null);

	if (!body || typeof body.id !== 'string' || typeof body.courseID !== 'string') {
		error(400, 'id und courseID erforderlich');
	}

	if (!allIds().includes(body.id)) {
		error(404, 'Unbekannte Seite');
	}

	const result = await toggleVote(body.id, body.courseID, voterId);
	return json(result);
};
