<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = $state(null);
	let game: any = $state(null);
	let betAmount = $state(10);
	let playing = $state(false);
	let playerCards: number[] = $state([]);
	let dealerCards: number[] = $state([]);
	let result: any = $state(null);
	let message = $state('');

	const sounds = {
		deal: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
		win: 'https://assets.mixkit.co/active_storage/sfx/2189/2189-preview.mp3',
		loss: 'https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3'
	};

	const playSound = (url: string) => {
		const audio = new Audio(url);
		audio.play().catch(() => {});
	};

	const suits = ['♠️', '♥️', '♣️', '♦️'];

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) return goto('/login');

		const userRes = await fetch(`http://${window.location.hostname}:3000/me`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		if (userRes.ok) {
			user = await userRes.json();
		} else {
			localStorage.removeItem('token');
			goto('/login');
			return;
		}

		const gamesRes = await fetch(`http://${window.location.hostname}:3000/games`);
		const games = await gamesRes.json();
		game = games.find((g: any) => g.type === 'blackjack');
	});

	function getCardDisplay(value: number) {
		if (value === 1) return 'A';
		if (value === 10) return ['10', 'J', 'Q', 'K'][Math.floor(Math.random() * 4)];
		return value.toString();
	}

	async function deal() {
		if (playing || !user || betAmount > user.balance) return;
		playing = true;
		message = 'KAARTEN KOMEN ERAAN...';
		result = null;
		playerCards = [];
		dealerCards = [];
		playSound(sounds.deal);

		await new Promise((r) => setTimeout(r, 600));

		const token = localStorage.getItem('token');
		const res = await fetch(`http://${window.location.hostname}:3000/games/blackjack/play`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ gameId: game.id, betAmount: Math.floor(betAmount) })
		});
		const data = await res.json();

		if (data.success === false) {
			message = data.message;
			playing = false;
			return;
		}

		playerCards = data.playerCards;
		dealerCards = data.dealerCards;
		result = data;
		user.balance = data.newBalance;

		if (data.result === 'WIN') {
			playSound(sounds.win);
			message = `GEWONNEN! LEKKER JONGE. +€${data.winAmount.toFixed(0)}`;
		} else if (data.result === 'PUSH') {
			message = 'GELIJKSPEL... NIEMAND WINT.';
		} else {
			playSound(sounds.loss);
			message = 'KONING FERDIN WINT WEER 🤡';
		}
		playing = false;
	}
</script>

<div class="relative min-h-screen overflow-hidden bg-black px-4 py-12">
	<!-- Background (Subtler) -->
	<div class="pointer-events-none absolute inset-0 z-0">
		<div
			class="h-full w-full bg-[repeating-linear-gradient(45deg,_#7e22ce_0px,_#7e22ce_1px,_transparent_1px,_transparent_60px)] opacity-5"
		></div>
		<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-slate-500 uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> ANDER SPEL KIEZEN
			</a>
			{#if user}
				<div
					class="rounded-3xl border border-purple-500/20 bg-slate-900/50 p-4 px-10 shadow-2xl backdrop-blur-2xl"
				>
					<div class="mb-1 text-[9px] font-black tracking-[0.6em] text-purple-400 uppercase">
						MOGELIJK KAPITAAL
					</div>
					<div class="text-4xl font-black text-[#fbbf24] italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<!-- Game Container -->
		<div class="overflow-hidden rounded-[5rem] border border-slate-900 bg-[#050505] shadow-2xl">
			<!-- Header -->
			<div
				class="relative overflow-hidden border-b border-slate-900 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-12 text-center text-white"
			>
				<h1 class="text-6xl font-black tracking-tighter uppercase italic md:text-8xl">
					FERDIN <span class="text-[#fbbf24]">JACK</span>
				</h1>
				<p class="mt-4 text-xs font-black tracking-[0.6em] text-white/40 uppercase italic">
					DE EIND-BAAS: KONING FERDIN
				</p>
			</div>

			<div class="p-16">
				<!-- Dealer -->
				<div class="mb-20">
					<h3
						class="mb-10 text-center text-[10px] font-black tracking-[0.8em] text-slate-700 uppercase"
					>
						DE KONING (DEALER)
					</h3>
					<div class="flex min-h-[220px] justify-center gap-6">
						{#each dealerCards as card}
							<div
								class="flex h-52 w-36 flex-col items-center justify-center rounded-[2rem] border-4 border-slate-900 bg-black text-6xl font-black shadow-xl"
							>
								<span class="text-purple-500">{getCardDisplay(card)}</span>
								<span class="mt-4 text-2xl opacity-30">{suits[Math.floor(Math.random() * 4)]}</span>
							</div>
						{:else}
							<div
								class="h-52 w-36 rounded-[2rem] border-4 border-dashed border-slate-900 flex items-center justify-center text-slate-900 text-6xl opacity-20"
							>
								👑
							</div>
						{/each}
					</div>
				</div>

				<!-- Message Area -->
				<div class="mb-20 flex h-32 items-center justify-center text-center">
					{#if message}
						<div
							class="animate-shake-slow rounded-[3rem] border border-[#fbbf24]/50 bg-black px-12 py-6 text-3xl font-black tracking-tighter text-white uppercase italic shadow-2xl"
						>
							<span
								class="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
								>{message}</span
							>
						</div>
					{:else}
						<div
							class="animate-pulse text-[10px] font-black tracking-[1em] text-slate-800 uppercase"
						>
							KAARTJE LEGGEN?
						</div>
					{/if}
				</div>

				<!-- Player -->
				<div class="mb-20">
					<div class="flex min-h-[220px] justify-center gap-6">
						{#each playerCards as card}
							<div
								class="flex h-52 w-36 flex-col items-center justify-center rounded-[2rem] border-4 border-purple-900 bg-black text-6xl font-black shadow-xl"
							>
								<span class="text-white">{getCardDisplay(card)}</span>
								<span class="mt-4 text-2xl opacity-30">{suits[Math.floor(Math.random() * 4)]}</span>
							</div>
						{/each}
					</div>
					<h3
						class="mt-10 text-center text-[10px] font-black tracking-[0.8em] text-purple-600 uppercase"
					>
						JIJ (OEFENGOKKER)
					</h3>
				</div>

				<!-- Controls -->
				<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
					<div class="rounded-[3rem] border border-slate-900 bg-[#0a0a0a] p-10">
						<label
							for="bj-bet"
							class="mb-6 block text-center text-[9px] font-black tracking-[0.6em] text-slate-700 uppercase"
							>ZET JE NEP GELD IN</label
						>
						<div class="flex items-center justify-center gap-10">
							<button
								onclick={() => (betAmount = Math.max(1, betAmount - 10))}
								class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-slate-800 active:scale-90"
								disabled={playing}>-</button
							>
							<div class="text-5xl font-black tracking-tighter text-white italic">
								€{betAmount}
							</div>
							<button
								onclick={() => (betAmount = Math.min(game?.max_bet || 500, betAmount + 10))}
								class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-slate-800 active:scale-90"
								disabled={playing}>+</button
							>
						</div>
					</div>

					<button
						onclick={deal}
						disabled={playing || !user || betAmount > user?.balance}
						class="rounded-[3rem] bg-[#fbbf24] text-2xl font-black text-slate-950 uppercase shadow-lg transition-all hover:scale-105 active:scale-95 disabled:grayscale"
					>
						{playing ? 'EVEN KIJKEN...' : 'DELEN MAAR 🚀'}
					</button>
				</div>
			</div>
		</div>

		<!-- Footer Rules -->
		<div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
			<div class="rounded-[3rem] border border-slate-900 bg-black p-12 shadow-xl">
				<h3 class="mb-6 text-xs font-black tracking-[0.6em] text-purple-500 uppercase">
					📖 DE REGELS (VIRTUEL)
				</h3>
				<ul class="space-y-4 text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
					<li class="flex items-start gap-4">
						<span class="text-[#fbbf24]">★</span> VERSLA DE KONING OF VERLIES JE VIRTUELE TAS
					</li>
					<li class="flex items-start gap-4">
						<span class="text-[#fbbf24]">★</span> BLACKJACK BETAALT 2.5X
					</li>
				</ul>
			</div>
			<div class="rounded-[3rem] border border-red-900/10 bg-black p-12 shadow-xl">
				<h3 class="mb-6 text-xs font-black tracking-[0.6em] text-red-700 uppercase">
					💡 FERDIN'S WIJSHEID
				</h3>
				<p
					class="text-[10px] leading-relaxed font-black tracking-widest text-slate-700 uppercase italic"
				>
					"SCHOOL IS VOOR MENSEN DIE NIET DURVEN TE GOKKEN OP HUN EIGEN TOEKOMST. HATSA!"
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
