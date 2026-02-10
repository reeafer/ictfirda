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
	<!-- Animated background (Subtler) -->
	<div class="absolute inset-0 z-0 opacity-20">
		<div
			class="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[150px]"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-slate-500 uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> TERUG NAAR OVERZICHT
			</a>
			{#if user}
				<div
					class="rounded-3xl border border-purple-500/20 bg-slate-900/50 p-4 px-8 shadow-xl backdrop-blur-xl"
				>
					<div class="mb-1 text-[9px] font-black tracking-[0.5em] text-purple-400 uppercase">
						JE VIRTUELE SALDO
					</div>
					<div class="text-3xl font-black text-[#fbbf24] italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<!-- Main Game Area -->
		<div class="overflow-hidden rounded-[4rem] border border-slate-900 bg-black shadow-2xl">
			<!-- Game Header -->
			<div
				class="relative overflow-hidden border-b border-slate-900 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-12 text-center text-white"
			>
				<div
					class="absolute top-4 right-8 animate-bounce text-[9px] font-black tracking-[0.5em] text-[#fbbf24] uppercase"
				>
					KONING FERDIN APPROVED
				</div>
				<h1 class="text-6xl font-black tracking-tighter uppercase italic md:text-8xl">
					SLOTS VAN DE <span class="text-[#fbbf24]">DOOD</span>
				</h1>
				<p class="mt-4 text-xs font-black tracking-[0.5em] text-white/50 uppercase">
					OEFEN HIER JE GOKKUNSTEN MET NEP GELD!
				</p>
			</div>

			<div class="p-16">
				<!-- Reels Display -->
				<div class="mb-16 flex justify-center gap-4 sm:gap-10">
					{#each reels as reel}
						<div
							class="flex h-56 w-full max-w-[180px] items-center justify-center rounded-[3rem] border-4 border-slate-900 bg-[#050505] text-8xl shadow-2xl transition-all duration-75"
							class:scale-95={spinning}
							class:animate-shake={result?.result === 'WIN'}
						>
							<span>{symbols[reel]}</span>
						</div>
					{/each}
				</div>

				<!-- Status Message -->
				<div class="mb-14 h-24 text-center">
					{#if message}
						<div
							class="animate-shake-slow text-4xl font-black tracking-tighter text-white uppercase italic md:text-5xl"
						>
							<span
								class="bg-gradient-to-r from-red-500 via-yellow-400 to-purple-600 bg-clip-text text-transparent"
								>{message}</span
							>
						</div>
					{:else}
						<div
							class="animate-pulse text-[10px] font-black tracking-[0.6em] text-slate-700 uppercase"
						>
							GOOI ER WAT GELD TEGENAAN...
						</div>
					{/if}
				</div>

				<!-- Bet Controls -->
				<div class="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
					<div class="rounded-[3rem] border border-purple-900/30 bg-[#050505] p-8">
						<label
							for="slots-bet"
							class="mb-4 block text-center text-[10px] font-black tracking-[0.5em] text-slate-600 uppercase"
							>INZET (VIRTUEL)</label
						>
						<div class="flex items-center justify-center gap-8">
							<button
								onclick={() => (betAmount = Math.max(1, betAmount - 5))}
								class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-red-600/20 active:scale-90"
								disabled={spinning}>-</button
							>
							<div class="text-5xl font-black tracking-tighter text-white italic">
								€{betAmount}
							</div>
							<button
								onclick={() => (betAmount = Math.min(game?.max_bet || 1000, betAmount + 5))}
								class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-emerald-600/20 active:scale-90"
								disabled={spinning}>+</button
							>
						</div>
					</div>

					<button
						onclick={spin}
						disabled={spinning || !user || betAmount > user?.balance}
						class="rounded-[3rem] bg-[#fbbf24] text-2xl font-black text-slate-950 uppercase shadow-lg transition-all hover:scale-105 active:scale-95 disabled:grayscale"
					>
						{spinning ? 'DRAAIEN...' : 'WAAG EEN GOKJE 🚀'}
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
