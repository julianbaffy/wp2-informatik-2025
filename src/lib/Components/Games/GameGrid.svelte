<script lang="ts">
    import type { GameLink } from "$lib/types/customTypes";
    import Download1 from "$lib/images/download1.svelte";
    import OnlineGaming from "$lib/images/online-gaming.svelte";
    import LikeButton from "../LikeButton.svelte";
    import { showHeartsFor } from "$lib/stores/likes.svelte";
    import { onMount, tick } from "svelte";
    import GamesThumbnailFallback from "$lib/images/GamesThumbnailFallback.png";

  let {courseID = "1", links} : {courseID: string, links: GameLink[]} = $props()
  // Filtere die Links basierend auf der übergebenen CourseID
  let filteredLinks = $derived(links.filter(link => link.courseID === courseID && (link.downloadUrl||link.onlineUrl)));

  filteredLinks = filteredLinks.sort((a, b) => a.title.localeCompare(b.title));

  function handleImgError(event: Event) {
    (event.currentTarget as HTMLImageElement).src = GamesThumbnailFallback;
  }

  let gridEl: HTMLDivElement | undefined = $state();
  let slotEls: (HTMLDivElement | undefined)[] = [];

  // Markiert Karten am Rand des Grids (letzte Zeile, erste/letzte Spalte), damit
  // sie beim Hover-Zoom nur nach innen bzw. nach oben wachsen statt über den
  // Bildschirmrand hinaus.
  function updateEdgeClasses() {
    const els = slotEls.filter((el): el is HTMLDivElement => !!el);
    if (!els.length) return;
    const maxTop = Math.max(...els.map((el) => el.offsetTop));
    const lefts = els.map((el) => el.offsetLeft);
    const minLeft = Math.min(...lefts);
    const maxLeft = Math.max(...lefts);
    const singleColumn = minLeft === maxLeft;
    els.forEach((el) => {
      el.classList.toggle("last-row", el.offsetTop === maxTop);
      el.classList.toggle("first-col", !singleColumn && el.offsetLeft === minLeft);
      el.classList.toggle("last-col", !singleColumn && el.offsetLeft === maxLeft);
    });
  }

  $effect(() => {
    filteredLinks;
    tick().then(updateEdgeClasses);
  });

  onMount(() => {
    const ro = new ResizeObserver(() => updateEdgeClasses());
    if (gridEl) ro.observe(gridEl);
    window.addEventListener("resize", updateEdgeClasses);


    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateEdgeClasses);
    };
  });

</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5em;
    padding: 1.5em;
    /* Wichtig: NICHT overflow:hidden setzen, sonst wird die
       herauszoomende Karte am Rand abgeschnitten. */
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3em 1em;
    color: #444;
  }

  .empty-state .games {
    font-size: 2.5em;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0;
  }

  /* Der Slot reserviert im Grid nur den Platz für das Thumbnail
     (16:9). Die eigentliche Karte liegt absolut darüber, damit sie
     beim Aufklappen/Zoomen über Nachbar-Kacheln ragen kann, ohne
     das Grid-Layout zu verschieben. */
  .card-slot {
    position: relative;
    aspect-ratio: 16 / 9;
    z-index: 1;
  }

  .card-slot:hover,
  .card-slot:focus-within {
    /* über die Nachbarkarten heben, während gehovert/fokussiert wird */
    z-index: 30;
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* bewusst kein "bottom" -> Höhe ergibt sich aus dem Inhalt,
       damit die Karte beim Aufklappen nach unten wachsen kann */
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: rgba(255, 255, 255, 0.55);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border-radius: 1em;
    overflow: hidden;
    box-shadow: 0 0.35em 1.2em rgba(0, 0, 0, 0.1);
    /* Werden je nach Rand-Position (Zeile/Spalte) unten überschrieben,
       damit die Karte nur nach innen bzw. oben wächst statt über den
       Bildschirmrand hinaus. */
    --origin-x: 50%;
    --origin-y: 50%;
    --row-lift: 0%;
    transform-origin: var(--origin-x) var(--origin-y);
    transition: transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow 0.28s ease;
    will-change: transform;
  }

  .card-slot:hover .card {
    transform: scale(1.25) translateY(var(--row-lift));
    box-shadow: 0 1.5em 3em rgba(0, 0, 0, 0.35);
  }

  /* Erste/letzte Spalte: nur nach innen (rechts bzw. links) vergrößern. */
  :global(.card-slot.first-col) .card {
    --origin-x: 0%;
  }

  :global(.card-slot.last-col) .card {
    --origin-x: 100%;
  }

  /* Letzte Zeile: nach oben statt nach unten vergrößern und zusätzlich ein
     Stück anheben, damit der komplette Card-Body sichtbar bleibt. */
  :global(.card-slot.last-row) .card {
    --origin-y: 100%;
    --row-lift: -15%;
  }

  .thumb-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #e5e5e5;
    flex-shrink: 0;
  }

  .thumb-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Titel als Fallback direkt im Slot anzeigen, wenn kein Thumbnail existiert */
  .thumb-title {
    position: absolute;
    inset: auto 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6em 0.8em;
    text-align: center;
    font-weight: 700;
    font-size: 1.1em;
    text-shadow: 0 0.1em 0.3em rgba(255, 254, 254, 0.4);
  }

  /* Standardmäßig unsichtbar/eingeklappt -> "zunächst nur Thumbnail" */
  .card-body {
    display: flex;
    flex-direction: column;
    max-height: 0;
    opacity: 0;
    padding: 0 1.2em;
    overflow: hidden;
    transition: max-height 0.32s ease, opacity 0.22s ease,
      padding 0.32s ease;
  }

  .card-slot:hover .card-body {
    max-height: 320px;
    opacity: 1;
    padding: 1em 1.2em 1.2em;
    transition-delay: 0.05s;
  }

  .card-body h3 {
    flex: 1;
    min-width: 0;
    font-size: 1.15em;
    font-weight: 700;
    padding-right: 0.5em;
    color: var(--color-text);
  }

  .card-body p {
    font-size: 0.92em;
    line-height: 1.4em;
    color: var(--color-text);
    /* Beschreibung kürzen, falls sehr lang */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .link-container {
    display: flex;
    gap: 0.7em;
  }

  a {
    text-decoration: none;
  }

  .link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.6em;
    height: 2.6em;
    border-radius: 0.7em;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.6);
    color: var(--color-text);
    transition: background 0.15s ease, border-color 0.15s ease,
      transform 0.15s ease;
  }

  .link-button.active {
    border-color: #333;
    color: var(--color-text);
  }

  .link-button.active:hover {
    color: #fff;
    transform: translateY(-0.1em);
  }

  .link-button.inactive {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Touch-Geräte haben kein zuverlässiges :hover -> Karte gleich
     komplett anzeigen, statt Infos hinter einer Geste zu verstecken. */
  @media (hover: none), (pointer: coarse) {
    .card-slot:hover,
    .card-slot:focus-within {
      /* Ohne Zoom-Effekt darf die Karte hier nicht über
         andere UI-Elemente (z. B. Tab-Controls) ragen. */
      z-index: 1;
    }

    .card {
      position: static;
      transform: none !important;
      box-shadow: 0 0.35em 1.2em rgba(0, 0, 0, 0.1) !important;
    }

    .card-slot {
      aspect-ratio: auto;
    }

    .card-body {
      max-height: none;
      opacity: 1;
      padding: 1em 1.2em 1.2em;
    }
  }
</style>

<div class="grid-container" bind:this={gridEl}>
  {#if filteredLinks.length === 0}
    <div class="empty-state">
      <p class="games">GAME OVER</p>
      <p>Für diesen Kurs wurden noch keine Spiele veröffentlicht.</p>
    </div>
  {:else}
    {#each filteredLinks as link, i}
      <div class="card-slot" bind:this={slotEls[i]}>
        <div class="card">
          <div class="thumb-wrapper">
            <img
              src={link.thumbnailUrl || GamesThumbnailFallback}
              alt={link.title}
              loading="lazy"
              onerror={handleImgError}
            />
            {#if !link.thumbnailUrl}
              <span class="thumb-title">{link.title}</span>
            {/if}
          </div>

          <div class="card-body">
            <div class="flex justify-between items-center">
              <h3>{link.title}</h3>
              {#if showHeartsFor(link.courseID, 'games')}
                <LikeButton id={link.id} courseID={link.courseID} />
              {/if}
            </div>
            {#if link.description}
              <p>{link.description}</p>
            {/if}

            <div class="footer-row">
              <div class="link-container">
                {#if link.onlineUrl}
                  <a href={link.onlineUrl} target="_blank" rel="noopener" onclick={blurOnClick}>
                    <button class="link-button active" title="Online spielen">
                      <span class="icon-wrapper"><OnlineGaming /></span>
                    </button>
                  </a>
                {:else}
                  <button class="link-button inactive" title="Kein Online-Link" disabled>
                    <span class="icon-wrapper"><OnlineGaming /></span>
                  </button>
                {/if}

                {#if link.downloadUrl}
                  <a href={link.downloadUrl} download="Pygame von {link.title}">
                    <button class="link-button active" title="Herunterladen">
                      <span class="icon-wrapper"><Download1 /></span>
                    </button>
                  </a>
                {:else}
                  <button class="link-button inactive" title="Kein Download verfügbar" disabled>
                    <span class="icon-wrapper"><Download1 /></span>
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
