<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function confirmReset(event: Event, courseID: string, label: string) {
		if (
			!confirm(
				`Wirklich alle Likes für "${label}" in Kurs ${courseID} zurücksetzen? Das kann nicht rückgängig gemacht werden.`
			)
		) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Admin – Likes</title>
</svelte:head>

<p><a href="/admin">← zurück zum Dashboard</a></p>

<h1>Like-Verwaltung</h1>

{#if form?.success}
	<p class="notice">
		{form.resetType === 'games' ? 'Spiele' : 'Websites'} in Kurs {form.resetCourseID} wurden zurückgesetzt.
	</p>
{/if}

{#if form?.toggled}
	<p class="notice">
		Likes für {form.toggleType === 'games' ? 'Spiele' : 'Websites'} in Kurs {form.toggleCourseID}
		sind jetzt {form.visible ? 'sichtbar' : 'ausgeblendet'}.
	</p>
{/if}

{#each data.courses as course}
	<section class="course">
		<h2>Kurs {course.courseID} ({course.teacher})</h2>

		{#if course.games.length === 0 && course.websites.length === 0}
			<p class="empty">Keine Projekte in diesem Kurs.</p>
		{/if}

		{#if course.games.length > 0}
			<div class="section-header">
				<h3>Spiele</h3>
				<div class="actions">
					<form method="POST" action="?/toggleGamesHearts" use:enhance>
						<input type="hidden" name="courseID" value={course.courseID} />
						<button type="submit" class="btn btn-toggle" class:active={course.gamesHeartsVisible}>
							{course.gamesHeartsVisible ? 'Likes ausblenden' : 'Likes anzeigen'}
						</button>
					</form>
					<form method="POST" action="?/resetGames" use:enhance>
						<input type="hidden" name="courseID" value={course.courseID} />
						<button
							type="submit"
							class="btn btn-reset"
							onclick={(e) => confirmReset(e, course.courseID, 'Spiele')}
						>
							Spiele zurücksetzen
						</button>
					</form>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						<th>Titel</th>
						<th>❤️</th>
					</tr>
				</thead>
				<tbody>
					{#each course.games as game}
						<tr>
							<td>{game.title}</td>
							<td>{game.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}

		{#if course.websites.length > 0}
			<div class="section-header">
				<h3>Websites</h3>
				<div class="actions">
					<form method="POST" action="?/toggleWebsitesHearts" use:enhance>
						<input type="hidden" name="courseID" value={course.courseID} />
						<button
							type="submit"
							class="btn btn-toggle"
							class:active={course.websitesHeartsVisible}
						>
							{course.websitesHeartsVisible ? 'Likes ausblenden' : 'Likes anzeigen'}
						</button>
					</form>
					<form method="POST" action="?/resetWebsites" use:enhance>
						<input type="hidden" name="courseID" value={course.courseID} />
						<button
							type="submit"
							class="btn btn-reset"
							onclick={(e) => confirmReset(e, course.courseID, 'Websites')}
						>
							Websites zurücksetzen
						</button>
					</form>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						<th>Titel</th>
						<th>❤️</th>
					</tr>
				</thead>
				<tbody>
					{#each course.websites as website}
						<tr>
							<td>{website.title}</td>
							<td>{website.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
{/each}

<style>
	.course {
		margin-bottom: 1.75rem;
		padding: 1.4em 1.6em;
		background: rgba(255, 255, 255, 0.55);
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 1em;
		box-shadow: 0 0.35em 1.2em rgba(0, 0, 0, 0.08);
	}

	.course h2 {
		margin: 0 0 0.7em;
		padding: 0 0 0.5em;
		font-size: 1.25em;
		font-weight: 700;
		color: var(--color-text);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.2rem;
		margin-bottom: 0.4rem;
	}

	.section-header h3 {
		margin: 0;
		font-size: 0.85em;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.45);
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	/* Einheitlicher Grundstil für alle Aktions-Buttons, angelehnt an
	   .link-button aus den Grid-Komponenten (gleiche Radien, Border-
	   und Hover-Sprache wie im Rest der Seite). */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55em 1em;
		border-radius: 0.7em;
		border: 1.5px solid rgba(0, 0, 0, 0.12);
		background: rgba(255, 255, 255, 0.6);
		color: var(--color-text);
		font-size: 0.85em;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			transform 0.15s ease,
			color 0.15s ease;
	}

	.btn:hover {
		border-color: rgba(0, 0, 0, 0.35);
		transform: translateY(-0.1em);
	}

	/* Aktiver Like-Toggle: dezent in der Theme-Akzentfarbe eingefärbt,
	   beim Hover (zum Ausschalten) vollflächig gefüllt. */
	.btn-toggle.active {
		background: rgba(255, 62, 0, 0.12);
		border-color: rgba(255, 62, 0, 0.45);
		color: var(--color-theme-1);
	}

	.btn-toggle.active:hover {
		background: var(--color-theme-1);
		border-color: var(--color-theme-1);
		color: #fff;
	}

	/* Reset ist destruktiv -> erst beim Hover farblich warnen, nicht
	   dauerhaft rot einfärben. */
	.btn-reset:hover {
		background: rgba(255, 62, 0, 0.08);
		border-color: rgba(255, 62, 0, 0.35);
		color: var(--color-theme-1);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 0.5rem;
		font-size: 0.92em;
	}

	th {
		text-align: left;
		padding: 0.5em 0.7em;
		font-size: 0.75em;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.4);
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	}

	td {
		text-align: left;
		padding: 0.5em 0.7em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.empty {
		color: rgba(0, 0, 0, 0.5);
		font-style: italic;
	}

	.notice {
		background: rgba(0, 150, 0, 0.1);
		border: 1px solid rgba(0, 150, 0, 0.3);
		padding: 0.6rem 0.9rem;
		border-radius: 0.7em;
	}
</style>
