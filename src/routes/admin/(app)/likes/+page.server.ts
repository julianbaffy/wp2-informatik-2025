import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	ensureCourseTracking,
	getCounts,
	getVisibleHeartsCourses,
	resetPages,
	toggleHeartsVisibility
} from '$lib/server/likes.server';
import gameCoursesData from '$lib/generated/games/courses.json';
import gameLinksData from '$lib/generated/games/games.json';
import websiteCoursesData from '$lib/generated/websites/courses.json';
import websiteLinksData from '$lib/generated/websites/links.json';
import type { Course, GameLink, WebsiteLink } from '$lib/types/customTypes';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const gameCourses = gameCoursesData as Course[];
	const websiteCourses = websiteCoursesData as Course[];
	const games = gameLinksData as GameLink[];
	const websites = websiteLinksData as WebsiteLink[];

	// Kurse aus beiden Projekttypen zusammenführen (dieselbe courseID
	// steht für dieselbe reale Klasse, egal ob Spiele, Websites oder beides).
	const courseMap = new Map<string, { courseID: string; teacher: string }>();
	for (const course of [...gameCourses, ...websiteCourses]) {
		courseMap.set(course.courseID, course);
	}
	const allCourses = Array.from(courseMap.values()).sort((a, b) =>
		a.courseID.localeCompare(b.courseID)
	);

	const heartsVisible = await getVisibleHeartsCourses();
	const gamesHeartsVisible = new Set(heartsVisible.games);
	const websitesHeartsVisible = new Set(heartsVisible.websites);

	const courseOverviews = [];
	for (const course of allCourses) {
		const gamesOfCourse = games
			.filter((g) => g.courseID === course.courseID)
			.sort((a, b) => a.title.localeCompare(b.title));
		const websitesOfCourse = websites
			.filter((w) => w.courseID === course.courseID)
			.sort((a, b) => a.title.localeCompare(b.title));

		const allIds = [...gamesOfCourse.map((g) => g.id), ...websitesOfCourse.map((w) => w.id)];

		// Sorgt dafür, dass auch Projekte ohne bisherige Likes im Kurs-Set
		// landen (z. B. für eine spätere Gesamtübersicht).
		await ensureCourseTracking(course.courseID, allIds);
		const counts = await getCounts(allIds);

		courseOverviews.push({
			courseID: course.courseID,
			teacher: course.teacher,
			games: gamesOfCourse.map((g) => ({ id: g.id, title: g.title, count: counts[g.id] ?? 0 })),
			websites: websitesOfCourse.map((w) => ({
				id: w.id,
				title: w.title,
				count: counts[w.id] ?? 0
			})),
			gamesHeartsVisible: gamesHeartsVisible.has(course.courseID),
			websitesHeartsVisible: websitesHeartsVisible.has(course.courseID)
		});
	}

	return { courses: courseOverviews };
};

function idsForCourse(courseID: string, type: 'games' | 'websites'): string[] {
	if (type === 'games') {
		return (gameLinksData as GameLink[])
			.filter((g) => g.courseID === courseID)
			.map((g) => g.id);
	}
	return (websiteLinksData as WebsiteLink[])
		.filter((w) => w.courseID === courseID)
		.map((w) => w.id);
}

export const actions: Actions = {
	resetGames: async ({ request }) => {
		const data = await request.formData();
		const courseID = data.get('courseID');

		if (typeof courseID !== 'string' || !courseID) {
			return fail(400, { error: 'Kurs fehlt.' });
		}

		await resetPages(idsForCourse(courseID, 'games'));
		return { success: true, resetCourseID: courseID, resetType: 'games' as const };
	},

	resetWebsites: async ({ request }) => {
		const data = await request.formData();
		const courseID = data.get('courseID');

		if (typeof courseID !== 'string' || !courseID) {
			return fail(400, { error: 'Kurs fehlt.' });
		}

		await resetPages(idsForCourse(courseID, 'websites'));
		return { success: true, resetCourseID: courseID, resetType: 'websites' as const };
	},

	toggleGamesHearts: async ({ request }) => {
		const data = await request.formData();
		const courseID = data.get('courseID');

		if (typeof courseID !== 'string' || !courseID) {
			return fail(400, { error: 'Kurs fehlt.' });
		}

		const visible = await toggleHeartsVisibility('games', courseID);
		return { toggled: true, toggleCourseID: courseID, toggleType: 'games' as const, visible };
	},

	toggleWebsitesHearts: async ({ request }) => {
		const data = await request.formData();
		const courseID = data.get('courseID');

		if (typeof courseID !== 'string' || !courseID) {
			return fail(400, { error: 'Kurs fehlt.' });
		}

		const visible = await toggleHeartsVisibility('websites', courseID);
		return { toggled: true, toggleCourseID: courseID, toggleType: 'websites' as const, visible };
	}
};
