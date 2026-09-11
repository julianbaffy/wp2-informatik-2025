import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Schützt alle Routen in dieser Gruppe: ohne gültige Session geht's
// zurück zum Login. Die Gruppe (app) ändert die URL nicht, betrifft
// also z. B. /admin, /admin/likes, ... aber nicht /admin/login selbst.
export const prerender = false;

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.isAdmin) {
		throw redirect(303, '/admin/login');
	}
};
