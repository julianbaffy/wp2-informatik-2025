<script lang="ts">
	import heartIcon from '$lib/images/heart.png';
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
	<img src={heartIcon} alt="" class="heart-icon" />
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
