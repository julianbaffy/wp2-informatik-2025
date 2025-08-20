<script lang="ts">
    import { onMount } from "svelte";
    import Clickable from "./clickable.svelte";

    let containerElement = $state<HTMLDivElement>();
    let containerWidth = $state(0);
    let containerHeight = $state(0);
    let clickables = $state<Array<{
        id: number;
        y: number;
        delay: number;
        size: number;
        velocity: number;
    }>>([]);

    function updateSize() {
        if (containerElement) {
            containerWidth = containerElement.offsetWidth;
            containerHeight = containerElement.offsetHeight;
            generateClickables();
        }
    }

    function generateClickables() {
        if (containerHeight === 0) return;

        const newClickables = [];
        const numClickables = Math.floor(containerHeight / 250)+1; // Every 300 pixels
        
        for (let i = 0; i < numClickables; i++) {
            const baseY = (i + 1) * 300-200;
            const maxDelay = Math.min(containerHeight * 6 + containerWidth * 5, 14000); // Higher container = wider delay range, max 10s
            
            newClickables.push({
                id: i,
                y: Math.max(0, Math.min(baseY, containerHeight - 60)), // Keep within bounds
                delay: Math.random() * maxDelay,
                size: 25 + Math.random() * 25, // Random size between 25-50px
                velocity: 60 + Math.random() * 40 // Random velocity between 60-100 px/s
            });
        }
        
        clickables = newClickables;
    }

    onMount(() => {
        updateSize();
        
        // Update on window resize
        const resizeObserver = new ResizeObserver(updateSize);
        if (containerElement) {
            resizeObserver.observe(containerElement);
        }

        return () => {
            resizeObserver.disconnect();
        };
    });
</script>

<div 
    bind:this={containerElement}
    class="clickable-container w-full h-full overflow-hidden"
    style="min-height: 100vh; z-index: 1;"
>
    {#each clickables as clickable (clickable.id)}
        <Clickable 
            containerWidth={containerWidth}
            y={clickable.y}
            delay={clickable.delay}
            size={clickable.size}
            velocity={clickable.velocity}
            random={100}
            variant="auto"
        />
    {/each}
</div>

<style>
    .clickable-container {
        position: absolute;
        inset: 0;
        overflow: visible;
    }
</style>