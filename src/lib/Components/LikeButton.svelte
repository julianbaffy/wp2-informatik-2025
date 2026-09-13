<script lang="ts">
	import HeartIcon from '$lib/images/HeartIcon.svelte';
	import { likeInfo, toggleLike } from '$lib/stores/likes.svelte';

	let { id, courseID }: { id: string; courseID: string } = $props();

	let pending = $state(false);
	let popping = $state(false);

	async function handleClick() {
		if (pending) return;
		pending = true;

		popping = false;
		// Neu triggern, falls die vorherige Animation noch läuft
		requestAnimationFrame(() => (popping = true));
		setTimeout(() => (popping = false), 400);

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
	<span class="icon" class:pop={popping}><HeartIcon filled={likeInfo(id).voted} /></span>
	<span class="count">{likeInfo(id).count}</span>
</button>

<style>
	.heart-button {
		display: inline-flex;
		position: relative;
		z-index: 2;
		flex-shrink: 0;
		align-items: center;
		gap: 0.35em;
		padding: 0.25em 0.6em;
		cursor: pointer;
		font-size: 1em;
		line-height: 1;
		font-weight: 600;
		color: #333;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.heart-button:disabled {
		cursor: default;
		opacity: 0.75;
	}

	.heart-button.voted .icon :global(svg) {
		color: #e0324c;
	}

	.heart-button.voted .count{
		color: #333;
	}

	.icon {
		display: inline-flex;
		width: 1.5em;
		height: 1.5em;
		transition: transform 0.15s ease;
	}

	.heart-button:hover .icon {
		transform: scale(1.075);
	}

	.icon.pop {
		animation: heart-pop 0.4s ease;
	}

	@keyframes heart-pop {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1.1);
		}
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
