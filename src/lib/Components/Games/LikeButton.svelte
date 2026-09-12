<script lang="ts">
	import HeartIcon from '$lib/images/HeartIcon.svelte';
	import { likeInfo, toggleLike } from '$lib/stores/likes.svelte';

	let { id, courseID }: { id: string; courseID: string } = $props();

	let pending = $state(false);

	async function handleClick() {
		if (pending) return;
		pending = true;
		await toggleLike(id, courseID);
		pending = false;
	}
</script>

<button
	class="heart-button"
	class:voted={likeInfo(id).voted}
	disabled={pending}
	onclick={handleClick}
	aria-pressed={likeInfo(id).voted}
	title={likeInfo(id).voted ? 'Gefällt mir entfernen' : 'Gefällt mir'}
>
	<span class="icon"><HeartIcon filled={likeInfo(id).voted} /></span>
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
		color: #888;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.heart-button:disabled {
		cursor: default;
		opacity: 0.75;
	}

	.heart-button.voted {
		color: #e0324c;
		border-color: rgba(224, 50, 76, 0.35);
	}

	.icon {
		display: inline-flex;
		width: 1.1em;
		height: 1.1em;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.count {
		min-width: 1em;
		text-align: left;
	}
</style>
