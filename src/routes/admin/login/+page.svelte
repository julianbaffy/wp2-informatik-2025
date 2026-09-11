<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin-Login</title>
</svelte:head>

<div class="login-container">
	<h1>Admin-Login</h1>

	<form method="POST" use:enhance>
		<label>
			Passwort
			<input type="password" name="password" autocomplete="current-password" required />
		</label>
		<button type="submit">Anmelden</button>
	</form>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}
</div>

<style>
	.login-container {
		max-width: 20rem;
		margin: 4rem auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 0.25rem;
	}

	.error {
		color: #c0392b;
	}
</style>
