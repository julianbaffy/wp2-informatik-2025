<script lang="ts">
	let { children } = $props();
</script>

<div class="admin-shell">
	<header class="admin-header">
		<span>Admin-Bereich</span>
		<form method="POST" action="/admin/logout">
			<button type="submit">Abmelden</button>
		</form>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		max-width: 60rem;
		margin: 0 auto;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
	}
</style>
