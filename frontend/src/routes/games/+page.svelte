<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/stores';

	let games: any[] = $state([]);
	let category = $state('All');

	onMount(async () => {
		const res = await fetch(`http://${window.location.hostname}:3000/games`);
		games = await res.json();
	});

	const categories = ['Alles', 'Klassiek', 'Modern'];

	function filterGames(g: any) {
		if (category === 'Alles') return true;
		if (category === 'Klassiek') return g.type === 'blackjack' || g.type === 'roulette';
		if (category === 'Modern') return g.type === 'slots';
		return true;
	}

	const gameIcons: any = {
		slots: '🎰',
		blackjack: '🃏',
		roulette: '🎡',
		poker: '🃏'
	};
</script>

<div class="animate-flash-insane relative min-h-screen overflow-hidden bg-black pb-32">
	<!-- Moving Background Line (Fake Graph) -->
	<div class="pointer-events-none absolute inset-0 opacity-20">
		<svg width="100%" height="100%" class="animate-sway">
			<path
				d="M0,500 L200,450 L400,480 L600,300 L800,400 L1000,100 L1200,250 L1400,50 L1600,200 L1800,150 L2000,300"
				fill="none"
				stroke="#fbbf24"
				stroke-width="20"
				stroke-linecap="round"
				class="animate-pulse"
			/>
		</svg>
	</div>

	<!-- Header Section -->
	<div
		class="animate-brainrot relative overflow-hidden border-b-8 border-yellow-500 bg-gradient-to-br from-purple-900 via-red-900 to-black pt-32 pb-48 text-white"
	>
		<div class="relative z-10 container mx-auto px-4 text-center">
			<div
				class="mb-8 inline-block animate-bounce rounded-2xl border-4 border-yellow-500 bg-yellow-500/10 px-6 py-2 text-2xl font-black tracking-[0.5em] text-[#fbbf24] uppercase"
			>
				KONING FERDIN'S GOKHAL 🔥🔥🔥
			</div>
			<h1
				class="animate-shake-extreme mb-6 text-7xl font-black tracking-tighter uppercase italic md:text-9xl"
			>
				<span class="animate-gok-text">KIES JE</span> <span class="text-[#fbbf24]">GELUK</span>
			</h1>
			<p
				class="animate-dopamine mx-auto max-w-2xl text-3xl font-black tracking-tight text-white uppercase italic"
			>
				GEEN ECHT GELD, GEEN ECHTE ZORGEN. GEWOON LEKKER GOKKEN BIJ DE KONING. HET IS TIJD VOOR EEN
				WINNERTJE. HATSA!
			</p>
		</div>
	</div>

	<div class="relative z-10 container mx-auto -mt-24 px-4">
		<!-- Filter Bar -->
		<div class="mb-16 flex flex-wrap items-center justify-center gap-8">
			<div
				class="animate-sway flex items-center gap-4 rounded-[2rem] border-4 border-yellow-500 bg-black p-4 shadow-2xl"
			>
				{#each categories as cat}
					<button
						onclick={() => (category = cat)}
						class="rounded-2xl px-10 py-5 text-xl font-black uppercase transition-all {category ===
						cat
							? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]'
							: 'text-slate-600 hover:text-white'}"
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- Games Grid -->
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each games.filter(filterGames) as game}
				<a
					href="/games/{game.type}"
					class="animate-tilt group relative overflow-hidden rounded-[3rem] border-4 border-slate-900 bg-[#0a0a0a] p-4 shadow-2xl transition-all hover:scale-110 hover:border-yellow-500"
				>
					<div
						class="animate-dopamine relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-black"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-red-600 to-purple-600 opacity-20 transition-all group-hover:opacity-60"
						></div>
						<div
							class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
						></div>

						<span class="animate-float-crazy relative z-10 text-[10rem]">
							{gameIcons[game.type] || '🎲'}
						</span>
					</div>
					<div class="p-8">
						<div
							class="animate-gok-text mb-3 text-sm font-black tracking-[0.4em] text-[#fbbf24] uppercase italic transition-all"
						>
							{game.type} 🔥
						</div>
						<h3
							class="animate-shake-slow mb-6 text-4xl font-black tracking-tight text-white uppercase italic"
						>
							{game.name}
						</h3>
						<div class="flex items-center justify-between border-t-4 border-slate-900/50 pt-6">
							<div
								class="animate-pulse text-xs font-black tracking-widest text-[#fbbf24] uppercase"
							>
								GOKKUNSTEN: MAX
							</div>
							<div
								class="animate-brainrot rounded-xl bg-purple-600 px-6 py-3 text-sm font-black text-white uppercase transition-all group-hover:bg-yellow-500 group-hover:text-black"
							>
								SPEEL NU 🚀
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: black;
	}
</style>
