<script lang="ts">
    
    import GameGrid from "./GameGrid.svelte";
    import GameTabsControls from "./GameTabsControls.svelte";
    import { onMount, } from "svelte";
    import type { WebsiteLink } from '$lib/types/customTypes';
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let {courses, links, startPosition='auto', smallButtons=false } = $props();

    let currentPosition=$state('1');

    function updateSearchParams(courseID: string){
        const params = new URLSearchParams(page.url.searchParams);
        params.set('course', courseID);

        const newUrl = `${page.url.pathname}?${params.toString()}`;

        goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
    }

    function openTab(id: string){
        currentPosition=id;
        var i;
        var x = document.getElementsByClassName("tab-item") as HTMLCollectionOf<HTMLElement>;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "block";
        }
        updateSearchParams(id);
    }
    
    // Intersection-Observer for tab-controls sentinel

    let tabContainer: HTMLDivElement;
	let isSticky = $state(false);

	// Intersection Observer einrichten
	onMount(() => {
        let resolved = false;

        // 1. StartPosition aus Props
        if (startPosition !== 'auto') {
            currentPosition = startPosition;
            openTab(startPosition);
            resolved = true;
        }
        
        // 2. Wenn es einen searchParam gibt
        if (!resolved) {
            const params = new URLSearchParams(window.location.search);
            const param = params.get('course');
            if (param) {
                currentPosition = param;
                openTab(param);
                resolved = true;
            }
        }
        
        // 3. Erster nicht-leerer Kurs
            if (!resolved && courses.length > 0 && links.length > 0) {
                for (let course of courses) {
                    if (links.some((link: WebsiteLink) => link.courseID === course.courseID)) {
                        currentPosition = course.courseID;
                        openTab(course.courseID);
                        resolved = true;
                        break;
                    }
                }
            }
        
         // 4. Fallback: erster Kurs
        if (!resolved && courses.length > 0) {
            currentPosition = courses[0].courseID;
            openTab(currentPosition);
        }

		function checkSticky() {
			const rect = tabContainer?.getBoundingClientRect();
			isSticky = rect?.top <= 14;
		}

		window.addEventListener('scroll', checkSticky, { passive: true });
		checkSticky();

		return () => {
			window.removeEventListener('scroll', checkSticky);
		};
	});
</script>


<div class="tab-container w-full mt-8" bind:this={tabContainer}>
	{#if isSticky}
		<div class="sticky-blur-overlay pointer-events-none"></div>
	{/if}

    <div class="tab-controls sticky top-14 w-full h-auto flex relative pb-4 z-20">
		{#each courses as course}
			<div class="button-container w-full text-center py-4 border-gray-400 {currentPosition === course.courseID ? 'border-x border-t rounded-t-[8px] bg-gradient-to-b from-white to-transparent' : 'border-b-1 hover:bg-gradient-to-t hover:from-white hover:to-transparent'} transition-opacity duration-200">
                <GameTabsControls courseID={course.courseID} courseTeacher={course.teacher} isActive={currentPosition === course.courseID} smallButtons={smallButtons} openTab={openTab} />
            </div>
		{/each}
	</div>
    <div class="tab-content w-full">
        {#each courses as course, i}
            <div id={course.courseID} class="tab-item {currentPosition === course.courseID ? 'block' : 'hidden'}">
                <GameGrid courseID={course.courseID} links={links} />
            </div>
        {/each}
    </div>
</div>

<style>
    .tab-controls::before {
	content: "";
	position: absolute;
	top: 0;
    left: -4em;
    right: -4em;
    height: 5em;
	backdrop-filter: blur(50px);
	-webkit-backdrop-filter: blur(50px);
	mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
	pointer-events: none;
	z-index: -1;
}

    .tab-controls{
        overflow-x: hidden;
        overflow-y: hidden;
        pointer-events: auto;
    }

.sticky-blur-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height:8em; /* oder größer bei Bedarf */
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
	-webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
	z-index: 10; /* unter .tab-controls (z-20), aber über allem anderen */
}

.tab-container{
    pointer-events: none;
}

</style>