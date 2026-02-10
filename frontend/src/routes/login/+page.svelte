<script lang="ts">
	import { user, login } from '$lib/stores';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const res = await fetch(`http://${window.location.hostname}:3000/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const result = await res.json();

			if (result.success === false) {
				alert('FOUTJE: ' + result.message);
				loading = false;
				return;
			}

			login(result);
			loading = false;
			goto('/');
		} catch (e) {
			console.error(e);
			loading = false;
			alert('KONING FERDIN ZEGT NEE. (Server stuk) HATSA!');
		}
	}
</script>

<div
	class="animate-flash-insane relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-20"
>
	<!-- Background Effects -->
	<div class="absolute inset-0 z-0">
		<div
			class="h-full w-full animate-pulse bg-[radial-gradient(circle_at_center,_#7e22ce_0%,_#000_80%)] opacity-40"
		></div>
		<div
			class="animate-shake-extreme absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-yellow-500/20"
		></div>
	</div>

	<div class="relative z-10 w-full max-w-lg">
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-yellow-500 text-6xl font-black text-white shadow-2xl"
			>
				👑
			</div>
			<h2
				class="animate-shake-extreme text-7xl font-black tracking-tighter text-white uppercase italic md:text-8xl"
			>
				<span class="animate-gok-text">IN</span><span class="text-[#fbbf24]">LOGGEN</span>
			</h2>
			<p class="animate-dopamine mt-4 text-2xl font-black text-slate-400 uppercase italic">
				BIJ DE KONING. GEWOON DOEN. HATSA! 🔥
			</p>
		</div>

		<div
			class="animate-sway relative overflow-hidden rounded-[4rem] border-8 border-yellow-500 bg-[#050505] p-12 shadow-[0_0_100px_rgba(251,191,36,0.3)]"
		>
			<form class="relative z-10 space-y-10" onsubmit={handleLogin}>
				<div>
					<label
						for="username"
						class="mb-4 block text-xl font-black tracking-widest text-[#fbbf24] uppercase"
						>WIE BEN JE?</label
					>
					<input
						id="username"
						type="text"
						required
						bind:value={username}
						class="block w-full animate-pulse rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-2xl font-black text-white transition-all focus:border-[#fbbf24] focus:outline-none"
						placeholder="gok_meester123"
					/>
				</div>

				<div>
					<label
						for="password"
						class="mb-4 block text-xl font-black tracking-widest text-[#fbbf24] uppercase"
						>GEHEIM WOORD?</label
					>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						class="block w-full animate-pulse rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-2xl font-black text-white transition-all focus:border-purple-600 focus:outline-none"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="animate-dopamine group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-purple-700 to-yellow-500 py-8 text-3xl font-black text-white uppercase shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
				>
					<span class="relative z-10">
						{#if loading}
							GEVALLETJE WACHTEN...
						{:else}
							GAAN MET DIE BANAAN 🚀 HATSA!
						{/if}
					</span>
				</button>
			</form>

			<div class="relative z-10 mt-12 border-t-4 border-slate-900 pt-10 text-center">
				<p class="text-xl font-black text-slate-500 uppercase">
					NOG GEEN ACCOUNT?
					<a href="/signup" class="animate-gok-text ml-2 text-[#fbbf24] underline transition-all"
						>REGISTREER NU JONGEN</a
					>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: black;
	}
</style>
