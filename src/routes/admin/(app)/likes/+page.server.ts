import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ensureCourseTracking, getCounts, resetCourse } from '$lib/server/likes.server';
import gameCoursesData from '$lib/generated/games/courses.json';
import gameLinksData from '$lib/generated/games/games.json';
import type { Course, GameLink } from '$lib/types/customTypes';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const courses = gameCoursesData as Course[];
	const games = gameLinksData as GameLink[];

	const courseOverviews = [];
	for (const course of courses) {
		const gamesOfCourse = games.filter((g) => g.courseID === course.courseID);
		const ids = gamesOfCourse.map((g) => g.id);

		// Sorgt dafür, dass auch Projekte ohne bisherige Likes im Kurs-Set
		// landen, damit "Kurs zurücksetzen" sie mit erfasst.
		await ensureCourseTracking(course.courseID, ids);
		const counts = await getCounts(ids);

		courseOverviews.push({
			courseID: course.courseID,
			teacher: course.teacher,
			games: gamesOfCourse
				.map((g) => ({ id: g.id, title: g.title, count: counts[g.id] ?? 0 }))
				.sort((a, b) => a.title.localeCompare(b.title))
		});
	}

	return { courses: courseOverviews };
};

export const actions: Actions = {
	resetCourse: async ({ request }) => {
		const data = await request.formData();
		const courseID = data.get('courseID');

		if (typeof courseID !== 'string' || !courseID) {
			return fail(400, { error: 'Kurs fehlt.' });
		}

		await resetCourse(courseID);
		return { success: true, resetCourseID: courseID };
	}
};
