<script lang="ts">
    import GameTabs from "$lib/Components/Games/GameTabs.svelte";
	import { onMount } from "svelte";
	import type { Course, GameLink } from "$lib/types/customTypes";
	import Online from "$lib/images/online-gaming.svelte";
	import Download1 from "$lib/images/download1.svelte";
	import ArrowUpRight from "$lib/images/ArrowUpRight.svelte";
	
	let { data } : {data: { links: GameLink[], courses: Course[];}} = $props();

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
	<title>WP2 - Pygames</title>
	<meta name="description" content="Showcase of students products in the Pygame project" />
</svelte:head>

<section class="relative" style="z-index: 10; pointer-events: none;">
	<h1 class="games">
		Spiele Programmieren
	</h1>

	<h2>
		<strong>mit Pygame Zero</strong>
	</h2>
</section>

<section class="content relative" style="z-index: 10; pointer-events: none;">
	<div class="description">
		<p>
			In diesem Projekt programmieren die Schülerinnen und Schüler zunächst einen klassischen Spaceshooter mithilfe der Python-Bibliothek
			"<a href="https://pygame-zero.readthedocs.io/en/stable/" class="underline" style="pointer-events: auto;">Pygame Zero</a>".
			Anschließend setzen sie eigene Spielideen um. Dabei lernen sie zentrale Konzepte der Programmierung mit Python kennen – unter anderem:</p>
			<ul>
				<li>den Umgang mit <strong>Objekten</strong> wie "Actor" und "Screen"</li>
				<li>den Unterschied zwischen <strong>globalen</strong> und <strong>lokalen Variablen</strong></li>
				<li>den Einsatz von <strong>if-Bedingungen</strong> für einfache Entscheidungslogik</li>
				<li>das <strong>Definieren und Aufrufen von Funktionen</strong></li>
				<li>das Verwenden von <strong> Listen und for-Schleifen</strong></li>
			</ul>

		<p>Neben dem Programmieren steht auch das kreative Game Design im Mittelpunkt –
			von der Steuerung über den Sound bis hin zu eigenen Grafiken.</p>
	</div>

	<div class="info-box content-box-dark" style="pointer-events: auto;">
		<h3 class="games">How to Play</h3>
		<div class="info-item">
			<span class="icon text-gray-200"><Online /></span>
			<div class="explanation">
				Zurzeit ist es noch nicht möglich, die Spiele direkt im Browser zu spielen.
			</div>
		</div>
		<div class="info-item">
			<span class="icon text-gray-200"><Download1 /></span>
			<div class="explanation">
				<ol>
					<li>Lade die zip-Datei herunter und entpacke den Spielordner.</li>
					<li>Installiere den <a href="https://codewith.mu/" class="underline" target="_blank" style="pointer-events: auto;"> MU Editor <ArrowUpRight /></a></li>
					<li>Klicke "load" und wähle die .py Datei im Spielordner aus.</li>
					<li>Klicke "run".</li>
				</ol>
			</div>
		</div>
	</div>
</section>

	<div style="z-index: 10; position: relative;">
		<GameTabs courses={data.courses} links={data.links} startPosition={manualStartPosition}  smallButtons={smallButtons} />
	</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		z-index: 10;
	}

	h1 {
		font-size: 80px;
		line-height: 0.6;
		margin-top: -0.05em;
		margin-bottom: 0.4em;
	}

	h3 {
		text-align: center;
		font-size: 60px;
		color: var(--color-theme-1-light);
		line-height: 0.5;
		margin-top: -0.05em;
		margin-bottom: 0.2em;
	}

	ul {
		margin-top: 0.9em;
		margin-bottom: 0.9em;
		list-style-type: square;
		align-items: start;
		padding-left: 2em;
		line-height: 1.6;
	}

	ol {
		list-style-type: decimal;
		padding-left: 1.2em;
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
		z-index: 10;
	}

	.description {
		flex: 1 1;
		margin-bottom: 1.5em;
		text-align: justify;
	}

	.info-box {
		flex: 0 0 320px;
		display: flex;
		flex-direction: column;
		gap: 1.2em;
		margin-top: 1em;
		backdrop-filter: blur(4px);
    	-webkit-backdrop-filter: blur(4px); /* für Safari */
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.6em;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 0.4em;
	}

	@media (max-width: 1060px) {
		.content {
			padding-inline: 1em;
		}
	}

	@media (max-width: 850px) {
	.content {
		display: block;
	}

	.info-box {
		margin-inline: 2em;
	}
	}

	@media (max-width: 850px) and (min-width: 600px) {

	.content {
		padding: 1em;
	}

	.info-box{
		margin-inline: 2em;
	}
	
	.info-item {
		flex-direction: row;
		align-items: flex-start;
		gap: 1em;
	}

	.icon {
		flex: 0 0 2em;
		align-items: flex-start;
		margin-right: 0.8em;
	}

	.explanation {
		flex: 1;
	}
	}

	@media (max-width: 599px) {
	
	.info-item {
		flex-direction: column;
	}

	.info-box {
		gap: 1em;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content {
		padding: 0em;
	}

	.info-box{
		margin-inline: 1em;
		margin-bottom: 2.5em;
	}
	}
</style>
