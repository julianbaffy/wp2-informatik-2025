<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function confirmReset(event: Event, courseID: string) {
		if (!confirm(`Wirklich alle Likes für Kurs ${courseID} zurücksetzen? Das kann nicht rückgängig gemacht werden.`)) {
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
	<p class="notice">Kurs {form.resetCourseID} wurde zurückgesetzt.</p>
{/if}

{#each data.courses as course}
	<section class="course">
		<div class="course-header">
			<h2>Kurs {course.courseID} ({course.teacher})</h2>
			<form method="POST" action="?/resetCourse" use:enhance>
				<input type="hidden" name="courseID" value={course.courseID} />
				<button type="submit" onclick={(e) => confirmReset(e, course.courseID)}>
					Kurs zurücksetzen
				</button>
			</form>
		</div>

		{#if course.games.length === 0}
			<p class="empty">Keine Spiele in diesem Kurs.</p>
		{:else}
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
	</section>
{/each}

<style>
	.course {
		margin-bottom: 2rem;
	}

	.course-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 0.5rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.4rem 0.6rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.empty {
		color: #666;
		font-style: italic;
	}

	.notice {
		background: rgba(0, 150, 0, 0.1);
		border: 1px solid rgba(0, 150, 0, 0.3);
		padding: 0.5rem 0.75rem;
		border-radius: 0.3rem;
	}

	button {
		cursor: pointer;
	}
</style>
