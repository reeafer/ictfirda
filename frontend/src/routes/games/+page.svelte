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

<div class="relative min-h-screen overflow-hidden bg-black pb-32">
	<!-- Moving Background Line (Fake Graph) -->
	<div class="pointer-events-none absolute inset-0 opacity-10">
		<svg width="100%" height="100%">
			<path
				d="M0,500 L200,450 L400,480 L600,300 L800,400 L1000,100 L1200,250 L1400,50 L1600,200 L1800,150 L2000,300"
				fill="none"
				stroke="#fbbf24"
				stroke-width="10"
				stroke-linecap="round"
			/>
		</svg>
	</div>

	<!-- Floating Particles (Subtler) -->
	<div class="pointer-events-none absolute inset-0">
		{#each Array(10) as _}
			<div
				class="animate-chaotic absolute text-4xl opacity-5"
				style="top: {Math.random() * 100}%; left: {Math.random() *
					100}%; animation-delay: {Math.random() * 10}s"
			>
				{['💸', '🎰', '💀', '🔥'][Math.floor(Math.random() * 4)]}
			</div>
		{/each}
	</div>

	<!-- Header Section -->
	<div
		class="relative overflow-hidden border-b border-purple-900/30 bg-gradient-to-br from-purple-950 via-black to-slate-950 pt-32 pb-48 text-white"
	>
		<div class="relative z-10 container mx-auto px-4 text-center">
			<div
				class="mb-8 inline-block rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-2 text-[10px] font-black tracking-[0.5em] text-[#fbbf24] uppercase"
			>
				KONING FERDIN'S GOKHAL
			</div>
			<h1
				class="animate-shake-slow mb-6 text-7xl font-black tracking-tighter uppercase italic md:text-8xl"
			>
				KIES JE <span class="text-[#fbbf24]">GELUK</span>
			</h1>
			<p
				class="mx-auto max-w-2xl text-xl font-black tracking-tight text-slate-500 uppercase italic"
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
				class="flex items-center gap-4 rounded-[2rem] border border-slate-900 bg-black p-2 shadow-2xl"
			>
				{#each categories as cat}
					<button
						onclick={() => (category = cat)}
						class="rounded-2xl px-10 py-3 text-xs font-black uppercase transition-all {category ===
						cat
							? 'bg-purple-600 text-white shadow-lg'
							: 'text-slate-600 hover:text-white'}"
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- Games Grid -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each games.filter(filterGames) as game}
				<a
					href="/games/{game.type}"
					class="group relative overflow-hidden rounded-[3rem] border border-slate-900 bg-[#0a0a0a] p-2 transition-all hover:-translate-y-2 hover:border-purple-600/50"
				>
					<div
						class="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2.5rem] bg-black"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-yellow-900/0 opacity-0 transition-all group-hover:from-purple-900/20 group-hover:to-yellow-900/20 group-hover:opacity-100"
						></div>
						<div
							class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"
						></div>

						<span
							class="relative z-10 text-[8rem] transition-all duration-300 group-hover:scale-110"
						>
							{gameIcons[game.type] || '🎲'}
						</span>
					</div>
					<div class="p-8">
						<div
							class="mb-3 text-[10px] font-black tracking-[0.4em] text-[#fbbf24] uppercase italic transition-all"
						>
							{game.type}
						</div>
						<h3 class="mb-6 text-2xl font-black tracking-tight text-white uppercase italic">
							{game.name}
						</h3>
						<div class="flex items-center justify-between border-t border-slate-900/50 pt-6">
							<div class="text-[9px] font-black tracking-widest text-slate-700 uppercase">
								GOKKUNSTEN: LAAG
							</div>
							<div
								class="rounded-xl border border-purple-900/50 bg-purple-900/10 px-5 py-2 text-[10px] font-black text-purple-400 uppercase transition-all group-hover:bg-purple-600 group-hover:text-white"
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
