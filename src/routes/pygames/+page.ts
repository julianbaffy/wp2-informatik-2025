import type { GameLink, Course } from '$lib/types/customTypes';
import rawGames from '$lib/generated/games/games.json';
import rawCourses from '$lib/generated/games/courses.json';
import type { PageLoad } from '../$types';

export const prerender = true;

const links = rawGames as GameLink[];
const courses = rawCourses as Course[];


export const load: PageLoad = async () => {
	return { links, courses };
};