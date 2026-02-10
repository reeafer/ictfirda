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
	class="animate-flash-insane relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-20"
>
	<!-- Background Effects -->
	<div class="absolute inset-0 z-0">
		<div
			class="h-full w-full animate-pulse bg-[radial-gradient(circle_at_center,_#7e22ce_0%,_#000_80%)] opacity-40"
		></div>
		<div
			class="animate-shake-extreme absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-red-900/20"
		></div>
	</div>

	<div class="relative z-10 w-full max-w-lg">
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-3xl bg-gradient-to-tr from-yellow-500 to-red-600 text-6xl font-black text-white shadow-2xl"
			>
				🤑
			</div>
			<h2
				class="animate-shake-extreme text-7xl font-black tracking-tighter text-white uppercase italic md:text-8xl"
			>
				REGIS<span class="text-purple-600">TREREN</span>
			</h2>
			<p class="animate-dopamine mt-4 text-2xl font-black text-slate-400 uppercase italic">
				WORD EEN OEFENGOKKER BIJ DE KONING. HATSA! 🔥
			</p>
		</div>

		<div
			class="animate-sway relative overflow-hidden rounded-[4rem] border-8 border-purple-600 bg-[#050505] p-12 shadow-[0_0_100px_rgba(126,34,206,0.3)]"
		>
			<form class="relative z-10 space-y-10" onsubmit={handleSignup}>
				<div>
					<label
						for="username"
						class="mb-4 block text-xl font-black tracking-widest text-purple-400 uppercase"
						>WIE WORD DE NIEUWE BAAS?</label
					>
					<input
						id="username"
						type="text"
						required
						bind:value={username}
						class="block w-full animate-pulse rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-2xl font-black text-white transition-all focus:border-purple-600 focus:outline-none"
						placeholder="JE NAAM HIER JONGE"
					/>
				</div>

				<div>
					<label
						for="password"
						class="mb-4 block text-xl font-black tracking-widest text-purple-400 uppercase"
						>JE GEHEIME CODE</label
					>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						class="block w-full animate-pulse rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-2xl font-black text-white transition-all focus:border-[#fbbf24] focus:outline-none"
						placeholder="PAS OP VOOR MEEKIJKERS"
					/>
				</div>

				<div class="flex items-start">
					<input
						id="terms"
						type="checkbox"
						required
						class="mt-1 h-8 w-8 animate-bounce rounded border-4 border-slate-900 bg-slate-950 text-purple-600 focus:ring-purple-600"
					/>
					<label
						for="terms"
						class="ml-4 block text-xs font-black tracking-widest text-slate-500 uppercase"
					>
						IK GA AKKOORD MET DE <a href="/terms" class="animate-gok-text text-purple-600 underline"
							>VOORWAARDEN</a
						> VAN KONING FERDIN. HATSA!
					</label>
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
							START HET AVONTUUR 🚀 HATSA!
						{/if}
					</span>
				</button>
			</form>

			<div class="relative z-10 mt-12 border-t-4 border-slate-900 pt-10 text-center">
				<p class="text-xl font-black text-slate-500 uppercase">
					AL EEN ACCOUNT?
					<a
						href="/login"
						class="animate-gok-text ml-2 text-[#fbbf24] italic underline transition-all"
						>LOG HIER IN JONGE</a
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
