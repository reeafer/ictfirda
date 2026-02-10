<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = $state(null);
	let game: any = $state(null);
	let betAmount = $state(10);
	let spinning = $state(false);
	let selectedBet: { type: string; value: any; label: string } | null = $state(null);
	let spinResult: number | null = $state(null);
	let result: any = $state(null);
	let message = $state('');
	let wheelRotation = $state(0);

	// Sound effects
	const playSound = (url: string) => {
		const audio = new Audio(url);
		audio.play().catch(() => {});
	};

	const sounds = {
		spin: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
		win: 'https://assets.mixkit.co/active_storage/sfx/2189/2189-preview.mp3',
		loss: 'https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3'
	};

	const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

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
		game = games.find((g: any) => g.type === 'roulette');
	});

	function selectBet(type: string, value: any, label: string) {
		selectedBet = { type, value, label };
	}

	function getNumberColor(num: number) {
		if (num === 0) return 'green';
		return redNumbers.includes(num) ? 'red' : 'black';
	}

	async function spin() {
		if (spinning || !user || !selectedBet || betAmount > user.balance) return;

		spinning = true;
		message = 'HET RAD DRAAIT... SPANNEND JONGENS.';
		result = null;
		spinResult = null;
		playSound(sounds.spin);

		const spinDuration = 2000;
		const startTime = Date.now();
		const spinInterval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			wheelRotation = (elapsed / 4) % 360;
			if (elapsed >= spinDuration) clearInterval(spinInterval);
		}, 10);

		await new Promise((resolve) => setTimeout(resolve, spinDuration));

		const token = localStorage.getItem('token');
		const res = await fetch(`http://${window.location.hostname}:3000/games/roulette/play`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({
				gameId: game.id,
				betAmount: Math.floor(betAmount),
				betType: selectedBet.type,
				betValue: selectedBet.value
			})
		});
		const data = await res.json();

		if (data.success === false) {
			message = data.message;
			spinning = false;
			return;
		}

		spinResult = data.spinResult;
		result = data;
		user.balance = data.newBalance;

		if (data.result === 'WIN') {
			playSound(sounds.win);
			message = `GEWONNEN! ${spinResult} IS DE WINNAAR. +€${data.winAmount.toFixed(0)}`;
		} else {
			playSound(sounds.loss);
			message = `${spinResult} - HELAAS, DE KONING PAKT ALLES.`;
		}
		spinning = false;
	}
</script>

<div class="relative min-h-screen overflow-hidden bg-black px-4 py-12">
	<!-- Background grid -->
	<div class="absolute inset-0 z-0 opacity-20">
		<div
			class="h-full w-full bg-[radial-gradient(circle_at_center,_#7e22ce_2px,_transparent_2px)] bg-[size:60px_60px]"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-yellow-500/20"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-2xl font-black tracking-[0.4em] text-white uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> ANDERE CHAOS ZOEKEN
			</a>
			{#if user}
				<div
					class="rounded-3xl border-4 border-yellow-500 bg-red-600 p-6 px-16 shadow-[0_0:50px_rgba(239,68,68,0.5)] backdrop-blur-3xl"
				>
					<div class="mb-1 text-xs font-black tracking-[0.6em] text-white uppercase">
						JE ZAKKEN ZIJN GEVULD:
					</div>
					<div class="text-6xl font-black text-yellow-300 italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<div class="grid gap-16 lg:grid-cols-5">
			<!-- Wheel Section -->
			<div class="space-y-10 lg:col-span-2">
				<div
					class="relative overflow-hidden rounded-[5rem] border-8 border-yellow-500 bg-[#050505] shadow-[0_0:100px_rgba(251,191,36,0.3)]"
				>
					<div
						class="overflow-hidden border-b-8 border-yellow-500 bg-gradient-to-r from-red-600 via-purple-700 to-red-600 p-12 text-center text-white"
					>
						<div
							class="absolute top-4 left-8 text-xl font-black tracking-[0.6em] text-white uppercase"
						>
							OEFENEN FR FR 👑
						</div>
						<h1 class="text-5xl font-black tracking-tighter uppercase italic md:text-7xl">
							RAD VAN <span class="text-[#fbbf24]">GELUK</span>
						</h1>
					</div>

					<div class="p-16 text-center">
						<div class="group relative mx-auto mb-14 h-96 w-96">
							<!-- Outer glow -->
							<div class="animate-zoom absolute inset-0 rounded-full bg-red-600/20 blur-3xl"></div>
							<div
								class="absolute inset-0 overflow-hidden rounded-full border-[20px] border-yellow-500 bg-black shadow-2xl"
								style="transform: rotate({wheelRotation}deg);"
							>
								<!-- Hub cap -->
								<div class="absolute top-0 left-1/2 z-20 h-16 w-4 -translate-x-1/2 bg-white"></div>
								{#each Array(24) as _, i}
									<div
										class="absolute top-1/2 left-1/2 h-44 w-2 origin-top -translate-x-1/2 bg-yellow-500/30"
										style="transform: rotate({i * 15}deg)"
									></div>
								{/each}
							</div>
							<div
								class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
							>
								{#if spinResult !== null}
									<div
										class="animate-shake-extreme text-9xl font-black text-white italic drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
									>
										{spinResult}
									</div>
								{:else}
									<div class="animate-spin text-9xl">🎡</div>
								{/if}
							</div>
						</div>

						<div class="mb-14 flex h-32 items-center justify-center">
							{#if message}
								<div
									class="animate-shake-extreme rounded-[4rem] border-8 border-white bg-red-600 px-12 py-8 text-4xl font-black tracking-tighter text-white uppercase italic shadow-2xl"
								>
									<span class="animate-gok-text">{message}</span>
								</div>
							{:else}
								<div
									class="animate-pulse text-2xl font-black tracking-[0.8em] text-[#fbbf24] uppercase"
								>
									ZET JE GELD IN JONGEN... 💸
								</div>
							{/if}
						</div>

						<!-- Bet Controls -->
						<div class="space-y-8">
							<div class="animate-tilt rounded-[3rem] border-4 border-yellow-500 bg-[#0a0a0a] p-10">
								<label
									for="roul-bet"
									class="mb-4 block text-center text-xl font-black tracking-[0.5em] text-[#fbbf24] uppercase"
									>HOEVEEL GOOI JE WEG?</label
								>
								<div class="flex items-center justify-center gap-10">
									<button
										onclick={() => (betAmount = Math.max(1, betAmount - 5))}
										class="h-16 w-16 rounded-2xl border-4 border-yellow-500 text-3xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
										disabled={spinning}>-</button
									>
									<div
										class="animate-gok-text text-6xl font-black tracking-tighter text-white italic"
									>
										€{betAmount}
									</div>
									<button
										onclick={() => (betAmount = Math.min(game?.max_bet || 1000, betAmount + 5))}
										class="h-16 w-16 rounded-2xl border-4 border-yellow-500 text-3xl font-black text-white transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
										disabled={spinning}>+</button
									>
								</div>
							</div>

							{#if selectedBet}
								<div
									class="animate-bounce rounded-3xl border-4 border-purple-600 bg-[#0a0a0a] p-8 text-center shadow-2xl"
								>
									<span class="text-2xl font-black tracking-[0.5em] text-white uppercase"
										>GESELECTEERD: {selectedBet.label} 🔥</span
									>
								</div>
							{/if}

							<button
								onclick={spin}
								disabled={spinning || !user || !selectedBet || betAmount > user?.balance}
								class="animate-dopamine w-full rounded-[3rem] border-8 border-white bg-[#fbbf24] py-10 text-4xl font-black text-slate-950 uppercase shadow-[0_0:100px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 disabled:grayscale"
							>
								{spinning ? 'DRAAIEN...' : 'WAAG EEN GOKJE 🚀 HATSA!'}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Betting Board -->
			<div class="space-y-12 lg:col-span-3">
				<div
					class="animate-sway relative overflow-hidden rounded-[5rem] border-8 border-slate-900 bg-[#050505] p-16 shadow-2xl"
				>
					<h3
						class="mb-10 text-center text-3xl font-black tracking-[0.8em] text-[#fbbf24] uppercase"
					>
						WAAR GAAN WE OP WEDDEN??
					</h3>

					<!-- Outside Bets -->
					<div class="mb-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
						<button
							onclick={() => selectBet('red', null, 'ROOD')}
							class="animate-pulse rounded-[2.5rem] border-8 py-10 text-2xl font-black uppercase transition-all {selectedBet?.type ===
							'red'
								? 'border-white bg-red-600 text-white shadow-2xl'
								: 'border-red-900/40 bg-black text-red-900 hover:border-red-600'}">ROOD</button
						>
						<button
							onclick={() => selectBet('black', null, 'ZWART')}
							class="animate-pulse rounded-[2.5rem] border-8 py-10 text-2xl font-black uppercase transition-all {selectedBet?.type ===
							'black'
								? 'border-white bg-slate-950 text-white shadow-2xl'
								: 'border-slate-900 bg-black text-slate-800 hover:border-white'}">ZWART</button
						>
						<button
							onclick={() => selectBet('even', null, 'EVEN')}
							class="animate-pulse rounded-[2.5rem] border-8 py-10 text-2xl font-black uppercase transition-all {selectedBet?.type ===
							'even'
								? 'border-white bg-purple-700 text-white shadow-2xl'
								: 'border-purple-900/40 bg-black text-purple-900 hover:border-purple-600'}"
							>EVEN</button
						>
						<button
							onclick={() => selectBet('odd', null, 'ONEVEN')}
							class="animate-pulse rounded-[2.5rem] border-8 py-10 text-2xl font-black uppercase transition-all {selectedBet?.type ===
							'odd'
								? 'border-white bg-purple-700 text-white shadow-2xl'
								: 'border-purple-900/40 bg-black text-purple-900 hover:border-purple-600'}"
							>ONEVEN</button
						>
					</div>

					<!-- Numbers Grid -->
					<div class="grid grid-cols-6 gap-4">
						<button
							onclick={() => selectBet('number', 0, '0')}
							class="col-span-6 animate-bounce rounded-[3.5rem] border-8 py-10 text-5xl font-black transition-all {selectedBet?.value ===
							0
								? 'border-white bg-emerald-600 text-white shadow-2xl'
								: 'border-emerald-900/20 bg-black text-emerald-900 hover:border-emerald-400'}"
							>0 (DE KONING)</button
						>
						{#each Array(36) as _, i}
							{@const num = i + 1}
							{@const isRed = redNumbers.includes(num)}
							<button
								onclick={() => selectBet('number', num, num.toString())}
								class="animate-zoom rounded-2xl border-4 py-8 text-3xl font-black transition-all {selectedBet?.value ===
								num
									? 'z-50 scale-125 border-white bg-purple-600 text-white shadow-2xl'
									: isRed
										? 'border-red-900/10 bg-black text-red-900 hover:border-red-600'
										: 'border-slate-900 bg-black text-slate-800 hover:border-white'}"
							>
								{num}
							</button>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-12">
					<div class="rounded-[3rem] border border-slate-900 bg-black p-10 shadow-xl">
						<h3 class="mb-6 text-xs font-black tracking-[0.5em] text-[#fbbf24] uppercase">
							💰 UITBETALINGEN
						</h3>
						<p class="text-[9px] font-black tracking-[0.4em] text-slate-700 uppercase italic">
							GETAL: 35X JE INZET<br />KLEUR/EVEN/ONEVEN: 2X JE INZET
						</p>
					</div>
					<div class="rounded-[3rem] border border-red-900/10 bg-black p-10 shadow-xl">
						<h3 class="mb-6 text-xs font-black tracking-[0.5em] text-red-700 uppercase">
							⚠️ BELANGRIJK
						</h3>
						<p
							class="text-[9px] leading-relaxed font-black tracking-[0.3em] text-slate-800 uppercase"
						>
							DIT IS EEN OEFEN RAD. GEEN ECHT GELD VERLOREN. GEWOON LEKKER DRAAIEN. HATSA!
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: black;
	}
</style>
