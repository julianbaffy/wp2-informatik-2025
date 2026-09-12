<script lang="ts">
	import { likeInfo, vote } from '$lib/stores/likes.svelte';

	let { id, courseID }: { id: string; courseID: string } = $props();

	let pending = $state(false);

	async function handleClick() {
		if (pending || likeInfo(id).voted) return;
		pending = true;
		await vote(id, courseID);
		pending = false;
	}
</script>

<button
	class="heart-button"
	class:voted={likeInfo(id).voted}
	disabled={pending || likeInfo(id).voted}
	onclick={handleClick}
	aria-pressed={likeInfo(id).voted}
	title={likeInfo(id).voted ? 'Danke für dein Feedback!' : 'Gefällt mir'}
>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="heart-icon">
		<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
	</svg>

	<span class="count">{likeInfo(id).count}</span>
</button>

<style>
	.heart-button {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		padding: 0.25em 0.6em;
		border-radius: 999px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		background: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		font-size: 0.9em;
		line-height: 1;
	}

	.heart-button:disabled {
		cursor: default;
	}

	.heart-icon {
		width: 1.1em;
		height: 1.1em;
		filter: grayscale(1) opacity(0.5);
		transition: filter 0.15s ease;
	}

	.heart-button.voted .heart-icon,
	.heart-button:not(:disabled):hover .heart-icon {
		filter: none;
	}

	.count {
		min-width: 1em;
		text-align: left;
	}
</style>
