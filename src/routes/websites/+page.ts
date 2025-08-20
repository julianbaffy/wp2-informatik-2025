import type { WebsiteLink, Course } from '$lib/types/customTypes';
import rawLinks from '$lib/generated/websites/links.json';
import rawCourses from '$lib/generated/websites/courses.json';
import type { PageLoad } from '../$types';

export const prerender = true;

const links = rawLinks as WebsiteLink[];
const courses = rawCourses as Course[];


export const load: PageLoad = async () => {
	return { links, courses };
};