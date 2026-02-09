<script lang="ts">
	import { user, login } from '$lib/stores';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);

	function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;

		// Simulate API call
		setTimeout(() => {
			login(username);
			loading = false;
			goto('/');
		}, 1000);
	}
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div
		class="w-full max-w-md space-y-8 rounded-2xl border border-white/5 bg-slate-800/50 p-8 backdrop-blur-sm"
	>
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-white">Log in to FirdaBet</h2>
			<p class="mt-2 text-center text-sm text-slate-400">
				Or
				<a href="/signup" class="font-medium text-emerald-400 hover:text-emerald-300">
					create a new account
				</a>
			</p>
		</div>
		<form class="mt-8 space-y-6" onsubmit={handleLogin}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div class="mb-4">
					<label for="username" class="sr-only">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						bind:value={username}
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-slate-600 bg-slate-700 px-3 py-3 text-white placeholder-slate-500 focus:z-10 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
						placeholder="Username"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						bind:value={password}
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-slate-600 bg-slate-700 px-3 py-3 text-white placeholder-slate-500 focus:z-10 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
						placeholder="Password"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-slate-400"> Remember me </label>
				</div>

				<div class="text-sm">
					<a href="#" class="font-medium text-emerald-400 hover:text-emerald-300">
						Forgot your password?
					</a>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						Logging in...
					{:else}
						Sign in
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
