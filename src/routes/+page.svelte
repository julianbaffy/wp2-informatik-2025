<script lang="ts">
	import { onMount } from "svelte";
	import Spaceshooter from '$lib/images/Spaceshooter.jpg';
	import DeviceMockups from "$lib/Components/Websites/DeviceMockups.svelte";

	let width = $state(0);

	function updateSize() {
    	width = window.innerWidth;
  	}

	onMount(() => {
		window.scrollTo(0, 0);
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	});
</script>

<svelte:head>
	<title>WP2 - Home</title>
	<meta name="description" content="Showcase of students products of different projects" />
</svelte:head>

<section>
	<h1>
		Projekte des WP II Informatik
	</h1>

	<h2>
		<strong>am Apostelgymnasium Köln</strong>
	</h2>
</section>

<div class="content-box flex justify-between m-4">
	<div class="image-container -translate-x-10 -translate-y-6 md:translate-y-0">
		<DeviceMockups />
	</div>
	<div class="description -translate-y-12 md:translate-y-0">
		<h3 class="websites text-[27px] mb-6 md:mb-2 md:text-[29px]">Websites mit HTML und CSS</h3>
		<p class="mt-3 md:text-[16px]">
			Was passiert eigentlich im Browser? Wie funktioniert eine Website?
			Mit HTML und CSS gestalten die Schülerinnen und Schüler Schritt für Schritt ihre eigene Website –
			vom ersten "Hello World" bis zur fertigen Projektseite. Einige Ergebnisse sind hier zu sehen.
		</p>
		<div class="button-container flex items-center">
			<a href="/websites" class="link-button dark"><span class="button-text">Projekte ansehen</span></a>
		</div>
	</div>
</div>

<div class="content-box-dark flex justify-between m-4">
	<div class="description md:pt-2">
		<h3 class="games leading-10 md:leading-1 mb-6 text-[65px]">Spiele mit <!--<br class="block sm:hidden">--> Pygame Zero</h3>
		<p class="mt-10">
			Mit der Python-Bibliothek Pygame Zero entwickeln die Schülerinnen und Schüler ihr erstes eigenes Computerspiel.
			Nach einem klassischen Spaceshooter entstehen eigene kreative Spielideen – programmiert mit Python und viel Fantasie.
			Probiere die fertigen Spiele selbst aus.
		</p>
		<div class="button-container flex items-center">
			<a href="/pygames" class="link-button"><span class="button-text">Projekte ansehen</span></a>
		</div>
	</div>
	<div class="image-container">
		<img src={Spaceshooter} alt="Screenshot of Spaceshooter Game">
	</div>
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h3 {
		padding-left: 5px;
	}

	.image-container {
		flex: 1 1 30%;
	}

	.description {
		width: auto;
		flex: 1 1 60%;
		margin-inline: 2em;
	}

	.content-box {
		margin-top: 2em;
	}

	.content-box-dark {
		margin-top: 3em;
	}

	.link-button {
		border-radius: 2.5em;
	}

	.link-button.dark:hover {
		border: solid;
		border-width: 1.5px;
	}

	.link-button:hover {
		border: solid;
		border-width: 1.5px;
	}

	@media (max-width: 768px) {
	.content-box {
		flex-direction: column;
		gap: 2.5em;
		align-items: center;
	}
	.content-box-dark {
		flex-direction: column;
		gap: 2.5em;
		align-items: center;
	}

	.image-container {
		width: 70%;
		max-width: 70%;
	}

	h3 {
		text-align: center;
		padding-left: 0px;
	}

	.description {
		margin-top: 0;
	}
	}

	@media (max-width: 599px) {
		.description {
			padding: 0px;
			margin: 0em;
		}
	}
</style>
