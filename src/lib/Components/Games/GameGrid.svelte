 <script lang="ts">
    import ArrowToIcon from "$lib/images/ArrowToIcon.svelte";
    import type { GameLink } from "$lib/types/customTypes";
    import Download1 from "$lib/images/download1.svelte";
    import Download2 from "$lib/images/download2.svelte";
    import OnlineGaming from "$lib/images/online-gaming.svelte";

  let {courseID = "1", links} : {courseID: string, links: GameLink[]} = $props()
  // Filtere die Links basierend auf der übergebenen CourseID
  let filteredLinks = $derived(links.filter(link => link.courseID === courseID && (link.downloadUrl||link.onlineUrl)));

  filteredLinks = filteredLinks.sort((a, b) => a.title.localeCompare(b.title));
</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25em;
    padding: 1.25em;
    pointer-events: none;
  }

  .tile {
    background-color: rgba(255, 255, 255, 0.4); /* statt opacity */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px); /* für Safari */
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.5em;
    padding: 1.17em;
    box-shadow:
    0.235em 0.235em 0.588em rgba(0, 0, 0, 0.1)  /* standard */;
    font-size: 17px;
    pointer-events: auto;
  }

  a {
    text-decoration: none;
  }

  a:hover {
	  text-decoration: underline;
  }

  .tile h3 {
    margin: 0.353em;
  }

  .tile p {
    font-size: 0.9em;
    color: #666;
  }

  .link-container {
    display: flex;
    gap: 0.8em;
    margin-top: 1em;
  }

  .link-button {
    padding: 0.3em 1.5em;
    border-radius: 0.3em;
    border: solid;
    border-color: currentColor;
    border-width: 1px;
  }

  .link-button.active {
    border-width: 1.2px;
  }
</style>

<div class="grid-container">
  {#if filteredLinks.length === 0}
    <section>
      <p class="games text-center text-6xl -mt-4">GAME OVER</p>
      <p class="text-center mt-4">Für diesen Kurs wurden noch keine Spiele veröffentlicht.</p>
    </section>
  {:else}
    {#each filteredLinks as link}
        <div class="tile">
          <h3>{link.title}</h3>
          {#if link.description}
            <p>{link.description}</p>
          {/if}
          <div class="link-container">
            {#if link.onlineUrl}
              <a href={link.onlineUrl} target="_blank" rel="noopener">
                <button class="link-button active"><span class="icon-wrapper"><OnlineGaming /></span></button>
              </a>
            {:else}
              <button class="link-button inactive"><span class="icon-wrapper"><OnlineGaming /></span></button>
            {/if}

            {#if link.downloadUrl}
              <a href={link.downloadUrl} download="Pygame von {link.title}">
                <button class="link-button active"><span class="icon-wrapper"><Download1 /></span></button>
              </a>
            {:else}
              <button class="link-button inactive"><span class="icon-wrapper"><Download1 /></span></button>
            {/if}
          </div>

        </div>
    {/each}
  {/if}
</div>
