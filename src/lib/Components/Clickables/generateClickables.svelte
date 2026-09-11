<script lang="ts">
    import { onMount } from "svelte";
    import Rock from "$lib/images/rock.png";
    import Heart from "$lib/images/heart.png";
    import Explosion from "$lib/images/explosion.png";

    type ClickableType = "rock" | "heart" | "explosion";

    let canvasElement: HTMLCanvasElement;
    let containerElement: HTMLDivElement;
    let context: CanvasRenderingContext2D;
    let animationFrame = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;

    const x: number[] = [];
    const y: number[] = [];
    const speeds: number[] = [];
    const sizes: number[] = [];
    const delays: number[] = [];
    const types: ClickableType[] = [];
    const opacities: number[] = [];
    let images: Record<ClickableType, HTMLImageElement>;

    function resizeCanvas() {
        if (!canvasElement || !containerElement || !context) return;

        const devicePixelRatio = window.devicePixelRatio || 1;
        width = containerElement.offsetWidth;
        height = containerElement.offsetHeight;
        canvasElement.width = width * devicePixelRatio;
        canvasElement.height = height * devicePixelRatio;
        canvasElement.style.width = `${width}px`;
        canvasElement.style.height = `${height}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        createClickables();
    }

    function createClickables() {
        x.length = 0;
        y.length = 0;
        speeds.length = 0;
        sizes.length = 0;
        delays.length = 0;
        types.length = 0;
        opacities.length = 0;

        const count = Math.floor(height / 250) + 1;
        const maxDelay = Math.min(height * 6 + width * 5, 14000);

        for (let index = 0; index < count; index++) {
            const size = 25 + Math.random() * 25;
            const yOffset = Math.random() * 200 - 100;
            x.push(width + size + 200);
            y.push(Math.max(0, Math.min((index + 1) * 300 - 200 + yOffset, height - size)));
            speeds.push(60 + Math.random() * 40);
            sizes.push(size);
            delays.push(Math.random() * maxDelay);
            types.push(Math.random() < 0.25 ? "heart" : "rock");
            opacities.push(1);
        }
    }

    function drawClickable(index: number) {
        const type = types[index];
        const image = images[type];
        if (!image || !image.complete || opacities[index] === 0) return;

        context.globalAlpha = opacities[index];
        context.drawImage(image, x[index], y[index], sizes[index], sizes[index]);
        context.globalAlpha = 1;
    }

    function animate(time: number) {
        const delta = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        context.clearRect(0, 0, width, height);

        for (let index = 0; index < x.length; index++) {
            if (delays[index] > 0) {
                delays[index] -= delta * 1000;
                continue;
            }

            x[index] -= speeds[index] * delta;

            if (x[index] < -sizes[index] - 200) {
                x[index] = width + sizes[index] + 200;
                delays[index] = 3000 + Math.random() * 3000;
                types[index] = Math.random() < 0.25 ? "heart" : "rock";
                opacities[index] = 1;
            }

            drawClickable(index);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function explode(event: MouseEvent) {
        const bounds = canvasElement.getBoundingClientRect();
        const clickX = event.clientX - bounds.left;
        const clickY = event.clientY - bounds.top;

        for (let index = 0; index < x.length; index++) {
            const hit = clickX >= x[index] && clickX <= x[index] + sizes[index]
                && clickY >= y[index] && clickY <= y[index] + sizes[index];

            if (hit && delays[index] <= 0 && types[index] === "heart") {
                opacities[index] = 0;
                delays[index] = 2000 + Math.random() * 2000;
                setTimeout(() => {
                    x[index] = width + sizes[index] + 200;
                    types[index] = Math.random() < 0.25 ? "heart" : "rock";
                    opacities[index] = 1;
                }, 2000 + Math.random() * 2000);
                break;
            }

            if (hit && types[index] === "rock" && delays[index] <= 0) {
                types[index] = "explosion";
                opacities[index] = 1;
                setTimeout(() => {
                    x[index] = width + sizes[index] + 200;
                    delays[index] = 2000 + Math.random() * 2000;
                    types[index] = Math.random() < 0.25 ? "heart" : "rock";
                }, 300);
                break;
            }
        }
    }

    onMount(() => {
        context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
        images = {
            rock: new Image(),
            heart: new Image(),
            explosion: new Image()
        };
        images.rock.src = Rock;
        images.heart.src = Heart;
        images.explosion.src = Explosion;
        resizeCanvas();

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(containerElement);
        window.addEventListener("click", explode);
        animationFrame = requestAnimationFrame(animate);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("click", explode);
            cancelAnimationFrame(animationFrame);
        };
    });
</script>

<div bind:this={containerElement} class="clickable-container" style="min-height: 100vh; z-index: 1;">
    <canvas bind:this={canvasElement} aria-hidden="true"></canvas>
</div>

<style>
    .clickable-container {
        position: absolute;
        inset: 0;
        overflow: hidden;
    }

    canvas {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>