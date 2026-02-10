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
	<!-- Background Effects -->
	<div class="pointer-events-none absolute inset-0 z-0">
		<div
			class="h-full w-full bg-[repeating-linear-gradient(45deg,_#7e22ce_0px,_#7e22ce_1px,_transparent_1px,_transparent_60px)] opacity-10"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-red-900/20"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-2xl font-black tracking-[0.3em] text-white uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> WEGWEZEN HIER
			</a>
			{#if user}
				<div
					class="rounded-3xl border-4 border-yellow-500 bg-red-600 p-6 px-16 shadow-[0_0_50px_rgba(239,68,68,0.5)] backdrop-blur-2xl"
				>
					<div class="mb-1 text-xs font-black tracking-[0.6em] text-white uppercase">
						JE ZIT OP EEN GOUDMIJN:
					</div>
					<div class="text-6xl font-black text-yellow-300 italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<!-- Game Container -->
		<div
			class="overflow-hidden rounded-[5rem] border-8 border-yellow-500 bg-[#050505] shadow-[0_0_100px_rgba(251,191,36,0.3)]"
		>
			<!-- Header -->
			<div
				class="relative overflow-hidden border-b-8 border-yellow-500 bg-gradient-to-r from-red-600 via-purple-700 to-red-600 p-12 text-center text-white"
			>
				<h1 class="text-7xl font-black tracking-tighter uppercase italic md:text-9xl">
					<span>FERDIN</span> <span class="text-[#fbbf24]">JACK</span>
				</h1>
				<p class="mt-4 text-2xl font-black tracking-[0.6em] text-white uppercase italic">
					DE EIND-BAAS: KONING FERDIN 🔥
				</p>
			</div>

			<div class="p-16">
				<!-- Dealer -->
				<div class="mb-20">
					<h3
						class="animate-gok-text mb-10 text-center text-2xl font-black tracking-[0.8em] text-yellow-500 uppercase"
					>
						DE KONING (DEALER) 👑
					</h3>
					<div class="flex min-h-[220px] justify-center gap-10">
						{#each dealerCards as card}
							<div
								class="animate-float-crazy flex h-64 w-44 flex-col items-center justify-center rounded-[2rem] border-8 border-slate-800 bg-white text-8xl font-black shadow-2xl"
							>
								<span class="text-black">{getCardDisplay(card)}</span>
								<span class="mt-4 text-4xl">{suits[Math.floor(Math.random() * 4)]}</span>
							</div>
						{:else}
							<div
								class="animate-pulse h-64 w-44 rounded-[2rem] border-8 border-dashed border-yellow-500 flex items-center justify-center text-[#fbbf24] text-9xl opacity-50"
							>
								👑
							</div>
						{/each}
					</div>
				</div>

				<!-- Message Area -->
				<div class="mb-20 flex h-48 items-center justify-center text-center">
					{#if message}
						<div
							class="animate-shake-extreme rounded-[4.5rem] border-8 border-white bg-red-600 px-20 py-10 text-6xl font-black tracking-tighter text-white uppercase italic shadow-[0_0_100px_rgba(255,255,255,0.5)]"
						>
							<span class="animate-gok-text">{message}</span>
						</div>
					{:else}
						<div
							class="animate-dopamine text-4xl font-black tracking-[1em] text-[#fbbf24] uppercase"
						>
							KAARTJE LEGGEN? 🃏
						</div>
					{/if}
				</div>

				<!-- Player -->
				<div class="mb-20">
					<div class="flex min-h-[220px] justify-center gap-10">
						{#each playerCards as card}
							<div
								class="animate-float-crazy flex h-64 w-44 flex-col items-center justify-center rounded-[2rem] border-8 border-purple-600 bg-white text-8xl font-black shadow-2xl"
							>
								<span class="text-black">{getCardDisplay(card)}</span>
								<span class="mt-4 text-4xl">{suits[Math.floor(Math.random() * 4)]}</span>
							</div>
						{/each}
					</div>
					<h3
						class="animate-gok-text mt-10 text-center text-2xl font-black tracking-[0.8em] text-purple-600 uppercase"
					>
						JIJ (TOEKOMSTIGE WINNAAR) 🤑
					</h3>
				</div>

				<!-- Controls -->
				<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
					<div class="animate-tilt rounded-[3rem] border-4 border-yellow-500 bg-[#0a0a0a] p-12">
						<label
							for="bj-bet"
							class="mb-6 block text-center text-xl font-black tracking-[0.6em] text-[#fbbf24] uppercase"
							>HOEVEEL GOOI JE WEG?</label
						>
						<div class="flex items-center justify-center gap-14">
							<button
								onclick={() => (betAmount = Math.max(1, betAmount - 10))}
								class="h-20 w-20 rounded-2xl border-4 border-yellow-500 text-4xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
								disabled={playing}>-</button
							>
							<div class="animate-gok-text text-7xl font-black tracking-tighter text-white italic">
								€{betAmount}
							</div>
							<button
								onclick={() => (betAmount = Math.min(game?.max_bet || 500, betAmount + 10))}
								class="h-20 w-20 rounded-2xl border-4 border-yellow-500 text-4xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
								disabled={playing}>+</button
							>
						</div>
					</div>

					<button
						onclick={deal}
						disabled={playing || !user || betAmount > user?.balance}
						class="animate-dopamine rounded-[3rem] border-8 border-white bg-[#fbbf24] text-5xl font-black text-slate-950 uppercase shadow-[0_0_100px_rgba(251,191,36,0.5)] transition-all hover:scale-110 active:scale-95 disabled:grayscale"
					>
						<span class="block animate-bounce">{playing ? 'WACHTEN...' : 'HATSAAA! 🚀'}</span>
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
