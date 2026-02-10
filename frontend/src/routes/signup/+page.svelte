<script lang="ts">
	import { user, login } from '$lib/stores';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleSignup(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const res = await fetch(`http://${window.location.hostname}:3000/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			if (!res.ok) {
				const errorText = await res.text();
				throw new Error(`Server Fout (${res.status}): ${errorText}`);
			}

			const result = await res.json();

			if (result.success === false) {
				alert('GEWEIGERD: ' + result.message);
				loading = false;
				return;
			}

			login(result);
			loading = false;
			goto('/');
		} catch (e: any) {
			console.error('Signup error:', e);
			loading = false;
			alert('KONING FERDIN ZEGT NEE: ' + (e.message || 'Server doet raar') + ' HATSA!');
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
				class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-yellow-500 to-slate-900 text-4xl font-black text-white shadow-2xl"
			>
				🤑
			</div>
			<h2
				class="animate-shake-slow text-6xl font-black tracking-tighter text-white uppercase italic"
			>
				REGIS<span class="text-purple-600">TREREN</span>
			</h2>
			<p class="mt-4 text-[10px] font-black tracking-[0.5em] text-slate-700 uppercase italic">
				WORD EEN OEFENGOKKER BIJ DE KONING. HATSA!
			</p>
		</div>

		<div
			class="relative overflow-hidden rounded-[4rem] border border-slate-900 bg-[#050505] p-12 shadow-2xl"
		>
			<form class="relative z-10 space-y-8" onsubmit={handleSignup}>
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
						class="block w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-5 text-lg font-black text-white transition-all focus:border-purple-600 focus:outline-none"
						placeholder="Kies een stoere naam"
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
						class="block w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-5 text-lg font-black text-white transition-all focus:border-[#fbbf24] focus:outline-none"
						placeholder="Minimaal 6 tekens"
					/>
				</div>

				<div class="flex items-start">
					<input
						id="terms"
						type="checkbox"
						required
						class="mt-1 h-5 w-5 rounded border-2 border-slate-900 bg-slate-950 text-purple-600 focus:ring-purple-600"
					/>
					<label
						for="terms"
						class="ml-3 block text-[9px] leading-relaxed font-black tracking-widest text-slate-700 uppercase"
					>
						IK GA AKKOORD MET DE <a href="/terms" class="text-purple-600 underline">VOORWAARDEN</a> VAN
						KONING FERDIN. HATSA!
					</label>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-slate-900 py-6 text-xl font-black text-white uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
				>
					<span class="relative z-10">
						{#if loading}
							BEZIG...
						{:else}
							START HET AVONTUUR 🚀
						{/if}
					</span>
				</button>
			</form>

			<div class="relative z-10 mt-12 border-t border-slate-900 pt-10 text-center">
				<p class="text-[9px] font-black tracking-[0.6em] text-slate-700 uppercase">
					AL EEN ACCOUNT?
					<a href="/login" class="ml-2 text-[#fbbf24] italic underline transition-all"
						>LOG HIER IN</a
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
