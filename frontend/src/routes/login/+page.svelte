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
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-20"
>
	<!-- Background (Subtler) -->
	<div class="absolute inset-0 z-0">
		<div
			class="h-full w-full bg-[radial-gradient(circle_at_center,_#7e22ce_0%,_#000_80%)] opacity-20"
		></div>
	</div>

	<div class="relative z-10 w-full max-w-lg">
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-slate-900 text-4xl font-black text-white shadow-2xl"
			>
				👑
			</div>
			<h2
				class="animate-shake-slow text-6xl font-black tracking-tighter text-white uppercase italic"
			>
				IN<span class="text-[#fbbf24]">LOGGEN</span>
			</h2>
			<p class="mt-4 text-[10px] font-black tracking-[0.5em] text-slate-700 uppercase italic">
				BIJ DE KONING. GEWOON DOEN. HATSA!
			</p>
		</div>

		<div
			class="relative overflow-hidden rounded-[4rem] border border-slate-900 bg-[#050505] p-12 shadow-2xl"
		>
			<form class="relative z-10 space-y-8" onsubmit={handleLogin}>
				<div>
					<label
						for="username"
						class="mb-4 block text-[9px] font-black tracking-[0.6em] text-slate-500 uppercase"
						>GEBRUIKERSNAAM</label
					>
					<input
						id="username"
						type="text"
						required
						bind:value={username}
						class="block w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-5 text-lg font-black text-white transition-all focus:border-[#fbbf24] focus:outline-none"
						placeholder="gok_meester123"
					/>
				</div>

				<div>
					<label
						for="password"
						class="mb-4 block text-[9px] font-black tracking-[0.6em] text-slate-500 uppercase"
						>WACHTWOORD</label
					>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						class="block w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-5 text-lg font-black text-white transition-all focus:border-purple-600 focus:outline-none"
						placeholder="••••••••"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							class="h-5 w-5 rounded border-2 border-slate-900 bg-slate-950 text-[#fbbf24] focus:ring-[#fbbf24]"
						/>
						<label
							for="remember-me"
							class="ml-3 block text-[9px] font-black tracking-widest text-slate-700 uppercase"
						>
							ONTHOUD MIJ
						</label>
					</div>

					<div class="text-[9px] font-black tracking-[0.4em] uppercase">
						<a href="/forgot-password" class="text-slate-800 transition-all hover:text-[#fbbf24]">
							WACHTWOORD KWIJT?
						</a>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-slate-900 py-6 text-xl font-black text-white uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
				>
					<span class="relative z-10">
						{#if loading}
							EVEN WACHTEN...
						{:else}
							GAAN MET DIE BANAAN 🚀
						{/if}
					</span>
				</button>
			</form>

			<div class="relative z-10 mt-12 border-t border-slate-900 pt-10 text-center">
				<p class="text-[9px] font-black tracking-[0.6em] text-slate-700 uppercase">
					NOG GEEN ACCOUNT?
					<a href="/signup" class="ml-2 text-[#fbbf24] underline transition-all">REGISTREER NU</a>
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
