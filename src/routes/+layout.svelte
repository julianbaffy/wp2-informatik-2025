<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import type { Page } from '@sveltejs/kit';
	import GenerateClickables from '$lib/Components/Clickables/generateClickables.svelte';

	// Definiere die möglichen Titel basierend auf dem Pfad
    const titles: Record<string, string> = {
        '/': 'home',
        '/websites': 'Websites',
        '/pygames': 'Pygames',
    };

	// Leite den Seitentitel aus der aktuellen URL ab
    const pageTitle = (page: Page) => titles[page.url.pathname] || '';
    const currentTitle = $derived(pageTitle(page));
	
	let { children } = $props();
</script>

<div class="app">
	<Header />
	<div class="main-container">

		<main>
			{@render children()}
		</main>
	</div>

	<footer>
		<div>
			<a href="/impress">Impressum</a>
		</div>
	</footer>

	<div class="absolute top-0 left-0 w-full h-full overflow-hidden {currentTitle === "Pygames" ? "block" : "hidden"}" style="z-index: 1;">
   	 	<GenerateClickables />
	</div>

</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100lvh;
		position: relative;
	}

	.main-container{
		margin-top: 6em;
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	main {
		padding: 1rem;
		width: 100%;
		max-width: 70rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: row;
		justify-content: end;
		align-items: center;
		padding: 12px;
		background-color: var(--color-bg-2) 50%;
		margin-left: 30px;
		margin-right: 30px;
	}
</style>
