 <script lang="ts">
  import ArrowToIcon from "$lib/images/ArrowToIcon.svelte";
	import type { WebsiteLink } from "$lib/types/customTypes";
	
  let {courseID = "1", links} : {courseID: string, links: WebsiteLink[]} = $props()

  // Filtere die Links basierend auf der übergebenen CourseID
  let filteredLinks = $derived(links.filter(link => link.courseID === courseID));

  filteredLinks = filteredLinks.sort((a, b) => a.title.localeCompare(b.title));
</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25em;
    padding: 1.25em;
  }

  a {
    text-decoration: none;
  }

  a:hover {
	text-decoration: underline;
  }

  .tile-group {
    transition: transform 0.2s ease;
  }

  .tile-group:hover {
    transform: translateY(-0.3em);
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
    transition: box-shadow 0.2s ease;
    box-shadow:
    0.235em 0.235em 0.588em rgba(0, 0, 0, 0.1);  /* standard */
    font-size: 17px;
  }

  .tile-group:hover .tile {
    box-shadow: 0 0.471em 0.706em rgba(0, 0, 0, 0.15);
  }

  .tile h3 {
    margin: 0.353em;
  }

  .tile p {
    font-size: 0.9em;
    color: #666;
  }
</style>

<div class="grid-container">
  {#if filteredLinks.length === 0}
    <section>
      <p class="websites text-center text-2xl mt-6">404 NOT FOUND</p>
      <p class="text-center mt-4">Für diesen Kurs wurden noch keine Websites veröffentlicht.</p>
    </section>

  {:else}
    {#each filteredLinks as link}
    <div class="relative tile-group">
      <a href="{link.url}">
        <div class="tile">
          <h3>{link.title}</h3>
          {#if link.description}
            <p>{link.description}</p>
          {/if}
        </div>
      </a>
      <a href="{link.url}" target="_blank" class="absolute arrow-button top-2 right-2 opacity-50 hover:opacity-100"><ArrowToIcon/></a>
    </div>
    {/each}
  {/if}
</div>
