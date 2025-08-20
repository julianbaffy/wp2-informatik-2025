<script lang="ts">
    import WebsiteTabs from "$lib/Components/Websites/WebsiteTabs.svelte";
	import { onMount } from "svelte";
	import type { Course, WebsiteLink } from "$lib/types/customTypes";
	import meme from '$lib/images/modern_webdevelopement.png';
	
	let { data } : {data: { links: WebsiteLink[], courses: Course[];}} = $props();

	let manualStartPosition = 'auto'; //set 'auto' for default behavior or any courseID to be opened when loading the page.

	let width = $state(0);

	function updateSize() {
    	width = window.innerWidth;
  	}

	onMount(() => {
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	});

	let smallButtons = $derived(width<700 && data.courses.length>=4 || width<540 && data.courses.length>=3);
</script>

<svelte:head>
	<title>WP2 - Websites</title>
	<meta name="description" content="Showcase of students products in the website project" />
</svelte:head>

<section>
	<h1 class="websites">
		Websites
	</h1>

	<h2>
		<strong>mit HTML und CSS</strong>
	</h2>
</section>

<section class="content">
	<div class="description">
		<p>
			Hier können Informationen und Bilder zum Projekt angezeigt werden.
		</p>
	</div>
	<!--<div class="info">
		<img src={meme} alt="Übersicht" class="mt-6 w-full" />
	</div>-->
</section>

<WebsiteTabs courses={data.courses} links={data.links} startPosition={manualStartPosition}  smallButtons={smallButtons} />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 2em;
		width: 100%;
		margin: 0 auto;
	}

	.description {
		flex: 1 1 50%;
		margin-top: 1em;
		text-align: justify;
	}

	.info {
		flex: 1 1 40%;
	}

	@media (max-width: 1060px) {
		.content {
			padding: 1em;
		}
	}

	@media (max-width: 914px) {
	.content {
		flex-direction: column;
		gap: 0.5em;
		align-items: center;
	}

	.info {
		width: 80%;
		max-width: 80%;
	}
	}

	@media (max-width: 914px) and (min-width: 600px) {
	.content {
		padding: 1em;
		align-items: center;
	}
	}

	@media (max-width: 599px) {
	.content {
		padding: 0em;
		align-items: center;
	}

	.info {
		width: 90%;
		max-width: 90%;
	}
}
</style>
