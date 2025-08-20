<script lang="ts">
    import { onMount } from "svelte";
    import Rock from "$lib/images/rock.png";
    import Heart from "$lib/images/heart.png";
    import Explosion from "$lib/images/explosion.png";

    let {
        containerWidth, 
        velocity, 
        delay = 0, 
        y, 
        random = 0, 
        variant = "auto", 
        size = 30
    } : {
        containerWidth: number; // width of the container
        velocity: number; // pixels per second
        delay?: number; // Starting delay in ms
        y: number; // y-Position in container
        random?: number; // random variation of y
        variant?: "heart" | "rock" | "auto";
        size?: number; // width and height of clickable in pixels
    } = $props();

    let objectState = $state("waiting"); // waiting, moving, exploding, hidden
    let variantInternal = $state("rock");
    let currentX = $state(-size - 10); // Start position off-screen right
    let animationId = $state(0);
    let isDestroyed = $state(false);

    // Calculate actual Y position with random variation
    let actualY = $state(y + (random > 0 ? Math.floor(Math.random() * random * 2) - random : 0));

    let image = $derived.by(() => {
        if (objectState === "exploding" && variantInternal === "rock") {
            return Explosion;
        }
        return variantInternal === "heart" ? Heart : Rock;
    });

    function startMovement() {
        if (isDestroyed) return;

        // Reset position and state
        currentX = containerWidth + size + 200; // Start off-screen right
        actualY = y + (random > 0 ? Math.floor(Math.random() * random * 2) - random : 0);

        // Set variant
        if (variant === "auto") {
            variantInternal = Math.random() < 0.25 ? "heart" : "rock";
        } else {
            variantInternal = variant;
        }

        objectState = "moving";

        // Start animation
        animate();
    }

    function animate() {
        if (objectState !== "moving" || isDestroyed) return;

        const step = velocity / 60; // 60 FPS
        currentX -= step;

        // Check if off-screen left
        if (currentX < -size - 200) {
            objectState = "hidden";
            // Restart after delay
            setTimeout(() => {
                if (!isDestroyed) startMovement();
            }, 3000 + Math.random() * 3000); // 3-6 second delay
            return;
        }

        animationId = requestAnimationFrame(animate);
    }

    function explode() {
        if (objectState !== "moving") return;
        
        objectState = "exploding";
        cancelAnimationFrame(animationId);
        
        setTimeout(() => {
            if (!isDestroyed) {
                objectState = "hidden";
                // Restart after delay
                setTimeout(() => {
                    if (!isDestroyed) startMovement();
                }, 2000 + Math.random() * 2000);
            }
        }, 300);
    }

    onMount(() => {
        // Start with initial delay
        setTimeout(() => {
            if (!isDestroyed) startMovement();
        }, delay);

        // Cleanup function
        return () => {
            isDestroyed = true;
            cancelAnimationFrame(animationId);
        };
    });
</script>

{#if objectState !== "hidden"}
    <button 
        type="button"
        aria-label={variantInternal}
        onclick={explode}
        style="
            position: absolute;
            top: {actualY}px;
            left: {currentX}px;
            width: {size}px;
            height: {size}px;
            cursor: default;
            user-select: none;
            z-index: 1;
            background: none;
            border: none;
            padding: 0;
        "
        class="transition-opacity duration-200 {objectState === 'exploding' ? 'opacity-75' : 'opacity-100'} {objectState === 'waiting' ? 'hidden' : ''}"
    >
        <img 
            src={image} 
            alt={variantInternal}
            width={size} 
            height={size}
            style="display: block;"
        />
    </button>
{/if}
