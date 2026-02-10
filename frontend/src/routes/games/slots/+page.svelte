<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = $state(null);
	let game: any = $state(null);
	let betAmount = $state(10);
	let spinning = $state(false);
	let reels = $state([0, 0, 0]);
	let result: any = $state(null);
	let message = $state('');

	const sounds = {
		spin: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
		win: 'https://assets.mixkit.co/active_storage/sfx/2189/2189-preview.mp3',
		loss: 'https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3'
	};

	const playSound = (url: string) => {
		const audio = new Audio(url);
		audio.play().catch(() => {});
	};

	const symbols = ['🎰', '🔥', '💸', '🤑', '💎', '🚀', '👑', '🤌', '💰', '💀'];

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
		game = games.find((g: any) => g.type === 'slots');
	});

	async function spin() {
		if (spinning || !user || betAmount > user.balance) return;
		spinning = true;
		message = '';
		result = null;
		playSound(sounds.spin);

		const spinDuration = 1200;
		const interval = 80;
		for (let i = 0; i < spinDuration / interval; i++) {
			reels = [
				Math.floor(Math.random() * 10),
				Math.floor(Math.random() * 10),
				Math.floor(Math.random() * 10)
			];
			await new Promise((r) => setTimeout(r, interval));
		}

		const token = localStorage.getItem('token');
		const res = await fetch(`http://${window.location.hostname}:3000/games/slots/play`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ gameId: game.id, betAmount: Math.floor(betAmount) })
		});
		const data = await res.json();

		if (data.success === false) {
			message = data.message;
			spinning = false;
			return;
		}

		reels = data.reels;
		result = data;
		user.balance = data.newBalance;

		if (data.result === 'WIN') {
			playSound(sounds.win);
			message = `JACKPOT HOOR! +€${data.winAmount.toFixed(0)}`;
		} else {
			playSound(sounds.loss);
			message = 'HELAAS PINDAKAAS...';
		}
		spinning = false;
	}
</script>

<div class="relative min-h-screen overflow-hidden bg-black px-4 py-12">
	<!-- Animated background -->
	<div class="absolute inset-0 z-0 opacity-40">
		<div
			class="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[150px]"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-bl from-red-600/20 via-transparent to-yellow-500/20"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-2xl font-black tracking-[0.3em] text-white uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> ANDER GOKKIE DOEN
			</a>
			{#if user}
				<div
					class="rounded-3xl border-4 border-yellow-500 bg-red-600 p-6 px-16 shadow-[0_0_50px_rgba(239,68,68,0.5)] backdrop-blur-xl"
				>
					<div class="mb-1 text-xs font-black tracking-[0.5em] text-white uppercase">
						JE VIRTUELE ZAKEN:
					</div>
					<div class="text-6xl font-black text-yellow-300 italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<!-- Main Game Area -->
		<div
			class="overflow-hidden rounded-[4rem] border-8 border-yellow-500 bg-black shadow-[0_0_100px_rgba(251,191,36,0.3)]"
		>
			<!-- Game Header -->
			<div
				class="relative overflow-hidden border-b-8 border-yellow-500 bg-gradient-to-r from-red-600 via-purple-700 to-red-600 p-12 text-center text-white"
			>
				<div
					class="absolute top-4 right-8 text-xl font-black tracking-[0.5em] text-white uppercase"
				>
					KONING FERDIN APPROVED 👑
				</div>
				<h1 class="text-7xl font-black tracking-tighter uppercase italic md:text-9xl">
					SLOTS VAN DE <span class="text-[#fbbf24]">DOOD</span>
				</h1>
				<p class="mt-4 text-2xl font-black tracking-[0.5em] text-white uppercase">
					OEFEN HIER JE GOKKUNSTEN MET NEP GELD! HATSA!
				</p>
			</div>

			<div class="p-16">
				<!-- Reels Display -->
				<div class="mb-16 flex justify-center gap-4 sm:gap-14">
					{#each reels as reel}
						<div
							class="flex h-72 w-full max-w-[220px] items-center justify-center rounded-[3rem] border-8 border-yellow-500 bg-[#050505] text-9xl shadow-[0_0_50px_rgba(251,191,36,0.2)] transition-all duration-75"
							class:animate-brainrot={spinning}
							class:animate-shake-extreme={result?.result === 'WIN'}
						>
							<span class="animate-float-crazy">{symbols[reel]}</span>
						</div>
					{/each}
				</div>

				<!-- Status Message -->
				<div class="mb-14 h-32 text-center">
					{#if message}
						<div
							class="animate-shake-extreme text-6xl font-black tracking-tighter text-white uppercase italic md:text-8xl"
						>
							<span class="animate-gok-text">{message}</span>
						</div>
					{:else}
						<div
							class="animate-dopamine text-2xl font-black tracking-[0.6em] text-[#fbbf24] uppercase"
						>
							GOOI ER WAT GELD TEGENAAN JONGEN... 💸
						</div>
					{/if}
				</div>

				<!-- Bet Controls -->
				<div class="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
					<div class="animate-tilt rounded-[3rem] border-4 border-yellow-500 bg-[#050505] p-12">
						<label
							for="slots-bet"
							class="mb-4 block text-center text-xl font-black tracking-[0.5em] text-[#fbbf24] uppercase"
							>INZET (VIRTUEL)</label
						>
						<div class="flex items-center justify-center gap-14">
							<button
								onclick={() => (betAmount = Math.max(1, betAmount - 5))}
								class="h-20 w-20 rounded-2xl border-4 border-yellow-500 text-4xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
								disabled={spinning}>-</button
							>
							<div class="animate-gok-text text-7xl font-black tracking-tighter text-white italic">
								€{betAmount}
							</div>
							<button
								onclick={() => (betAmount = Math.min(game?.max_bet || 1000, betAmount + 5))}
								class="h-20 w-20 rounded-2xl border-4 border-yellow-500 text-4xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
								disabled={spinning}>+</button
							>
						</div>
					</div>

					<button
						onclick={spin}
						disabled={spinning || !user || betAmount > user?.balance}
						class="animate-dopamine rounded-[3rem] border-8 border-white bg-[#fbbf24] text-5xl font-black text-slate-950 uppercase shadow-[0_0_100px_rgba(251,191,36,0.5)] transition-all hover:scale-110 active:scale-95 disabled:grayscale"
					>
						<span class="block animate-bounce">{spinning ? 'DRAAIEN...' : 'WAAG EEN GOKJE 🚀'}</span
						>
					</button>
				</div>
			</div>
		</div>

		<!-- Footer Info -->
		<div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
			<div class="rounded-[3rem] border border-slate-900 bg-black p-10 shadow-xl">
				<h3 class="mb-8 text-xs font-black tracking-[0.5em] text-purple-400 uppercase">
					💸 UITBETALINGEN (HATSA)
				</h3>
				<div class="space-y-6">
					<div class="flex justify-between text-lg font-black text-slate-500 uppercase italic">
						<span>Drie Schedels 💀</span>
						<span class="text-[#fbbf24]">100X JE INZET</span>
					</div>
					<div class="flex justify-between text-lg font-black text-slate-500 uppercase italic">
						<span>Drie Gelijk</span>
						<span class="text-purple-500">10X JE INZET</span>
					</div>
				</div>
			</div>
			<div class="rounded-[3rem] border border-red-900/20 bg-black p-10 shadow-xl">
				<h3 class="mb-8 text-xs font-black tracking-[0.5em] text-red-700 uppercase">
					⚠️ BELANGRIJK
				</h3>
				<p class="text-[10px] leading-relaxed font-black tracking-[0.2em] text-slate-700 uppercase">
					DIT IS GEEN ECHT CASINO. WE OEFENEN HIER GEWOON VOOR DE LEUK. KONING FERDIN IS NIET
					VERANTWOORDELIJK VOOR JE HUISWERK. HATSA! DAT DACHT IK JONGE.
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
