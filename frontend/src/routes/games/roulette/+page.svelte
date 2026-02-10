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
	<!-- Background grid (Subtler) -->
	<div class="absolute inset-0 z-0 opacity-10">
		<div
			class="h-full w-full bg-[radial-gradient(circle_at_center,_#7e22ce_1px,_transparent_1px)] bg-[size:40px_40px]"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl">
		<!-- Navigation -->
		<div class="mb-12 flex items-center justify-between">
			<a
				href="/games"
				class="flex items-center gap-2 text-xs font-black tracking-[0.4em] text-slate-500 uppercase transition-colors hover:text-[#fbbf24]"
			>
				<span>←</span> TERUG NAAR DE GOKHAL
			</a>
			{#if user}
				<div
					class="rounded-3xl border border-purple-500/20 bg-slate-900/50 p-4 px-10 shadow-xl backdrop-blur-3xl"
				>
					<div class="mb-1 text-[9px] font-black tracking-[0.6em] text-purple-400 uppercase">
						OEFEN BUDGET
					</div>
					<div class="text-4xl font-black text-[#fbbf24] italic">
						€{user.balance?.toFixed(0)}
					</div>
				</div>
			{/if}
		</div>

		<div class="grid gap-16 lg:grid-cols-5">
			<!-- Wheel Section -->
			<div class="space-y-10 lg:col-span-2">
				<div
					class="relative overflow-hidden rounded-[5rem] border border-slate-900 bg-[#050505] shadow-2xl"
				>
					<div
						class="overflow-hidden border-b border-slate-900 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-12 text-center text-white"
					>
						<div
							class="absolute top-4 left-8 animate-bounce text-[9px] font-black tracking-[0.6em] text-[#fbbf24] uppercase"
						>
							OEFENEN FR FR
						</div>
						<h1 class="text-5xl font-black tracking-tighter uppercase italic md:text-6xl">
							RAD VAN <span class="text-[#fbbf24]">GELUK</span>
						</h1>
					</div>

					<div class="p-16 text-center">
						<div class="group relative mx-auto mb-14 h-80 w-80">
							<!-- Outer glow -->
							<div class="absolute inset-0 rounded-full bg-purple-600/10 blur-3xl"></div>
							<div
								class="absolute inset-0 overflow-hidden rounded-full border-[15px] border-slate-900 bg-black shadow-2xl"
								style="transform: rotate({wheelRotation}deg);"
							>
								<!-- Hub cap -->
								<div
									class="absolute top-0 left-1/2 z-20 h-10 w-2 -translate-x-1/2 bg-[#fbbf24]"
								></div>
								{#each Array(24) as _, i}
									<div
										class="absolute top-1/2 left-1/2 h-36 w-1 origin-top -translate-x-1/2 bg-slate-800/50"
										style="transform: rotate({i * 15}deg)"
									></div>
								{/each}
							</div>
							<div
								class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
							>
								{#if spinResult !== null}
									<div
										class="animate-shake-slow text-8xl font-black text-white italic drop-shadow-2xl"
									>
										{spinResult}
									</div>
								{:else}
									<div class="animate-spin text-7xl opacity-20">🎡</div>
								{/if}
							</div>
						</div>

						<div class="mb-14 flex h-24 items-center justify-center">
							{#if message}
								<div
									class="animate-shake-slow text-2xl font-black tracking-tighter text-white uppercase italic md:text-3xl"
								>
									<span
										class="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
										>{message}</span
									>
								</div>
							{:else}
								<div
									class="animate-pulse text-[10px] font-black tracking-[0.8em] text-slate-700 uppercase"
								>
									ZET JE GELD IN...
								</div>
							{/if}
						</div>

						<!-- Bet Controls -->
						<div class="space-y-8">
							<div class="rounded-[3rem] border border-slate-900 bg-[#0a0a0a] p-8">
								<label
									for="roul-bet"
									class="mb-4 block text-center text-[9px] font-black tracking-[0.5em] text-slate-700 uppercase"
									>INZET (VIRTUEL)</label
								>
								<div class="flex items-center justify-center gap-8">
									<button
										onclick={() => (betAmount = Math.max(1, betAmount - 5))}
										class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-slate-800 active:scale-90"
										disabled={spinning}>-</button
									>
									<div class="text-5xl font-black tracking-tighter text-white italic">
										€{betAmount}
									</div>
									<button
										onclick={() => (betAmount = Math.min(game?.max_bet || 1000, betAmount + 5))}
										class="h-14 w-14 rounded-2xl border-2 border-slate-900 text-2xl font-black text-white transition-all hover:bg-slate-800 active:scale-90"
										disabled={spinning}>+</button
									>
								</div>
							</div>

							{#if selectedBet}
								<div
									class="rounded-3xl border border-purple-900/30 bg-[#0a0a0a] p-6 text-center shadow-xl"
								>
									<span class="text-xs font-black tracking-[0.5em] text-[#fbbf24] uppercase"
										>GESELECTEERD: {selectedBet.label}</span
									>
								</div>
							{/if}

							<button
								onclick={spin}
								disabled={spinning || !user || !selectedBet || betAmount > user?.balance}
								class="w-full rounded-[3rem] bg-[#fbbf24] py-8 text-2xl font-black text-slate-950 uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale"
							>
								{spinning ? 'DRAAIEN...' : 'WAAG EEN GOKJE 🚀'}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Betting Board -->
			<div class="space-y-12 lg:col-span-3">
				<div
					class="relative overflow-hidden rounded-[5rem] border border-slate-900 bg-[#050505] p-16 shadow-2xl"
				>
					<h3
						class="mb-10 text-center text-[10px] font-black tracking-[0.8em] text-slate-800 uppercase"
					>
						WAAR GA JE OP WEDDEN?
					</h3>

					<!-- Outside Bets -->
					<div class="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
						<button
							onclick={() => selectBet('red', null, 'ROOD')}
							class="rounded-[2.5rem] border-4 py-8 text-sm font-black uppercase transition-all {selectedBet?.type ===
							'red'
								? 'border-[#fbbf24] bg-red-600 text-white shadow-xl'
								: 'border-red-900/20 text-red-900 hover:border-red-600'}">ROOD</button
						>
						<button
							onclick={() => selectBet('black', null, 'ZWART')}
							class="rounded-[2.5rem] border-4 py-8 text-sm font-black uppercase transition-all {selectedBet?.type ===
							'black'
								? 'border-[#fbbf24] bg-slate-950 text-white shadow-xl'
								: 'border-slate-900 text-slate-800 hover:border-white'}">ZWART</button
						>
						<button
							onclick={() => selectBet('even', null, 'EVEN')}
							class="rounded-[2.5rem] border-4 py-8 text-sm font-black uppercase transition-all {selectedBet?.type ===
							'even'
								? 'border-[#fbbf24] bg-purple-700 text-white shadow-xl'
								: 'border-purple-900/20 text-purple-900 hover:border-purple-600'}">EVEN</button
						>
						<button
							onclick={() => selectBet('odd', null, 'ONEVEN')}
							class="rounded-[2.5rem] border-4 py-8 text-sm font-black uppercase transition-all {selectedBet?.type ===
							'odd'
								? 'border-[#fbbf24] bg-purple-700 text-white shadow-xl'
								: 'border-purple-900/20 text-purple-900 hover:border-purple-600'}">ONEVEN</button
						>
					</div>

					<!-- Numbers Grid -->
					<div class="grid grid-cols-6 gap-3">
						<button
							onclick={() => selectBet('number', 0, '0')}
							class="col-span-6 rounded-[3rem] border-4 py-8 text-xl font-black transition-all {selectedBet?.value ===
							0
								? 'border-[#fbbf24] bg-emerald-600 text-white shadow-xl'
								: 'border-emerald-900/10 text-emerald-900 hover:border-emerald-400'}"
							>0 (DE KONING)</button
						>
						{#each Array(36) as _, i}
							{@const num = i + 1}
							{@const isRed = redNumbers.includes(num)}
							<button
								onclick={() => selectBet('number', num, num.toString())}
								class="rounded-2xl border-2 py-6 text-lg font-black transition-all {selectedBet?.value ===
								num
									? 'scale-110 border-[#fbbf24] bg-purple-600 text-white shadow-xl'
									: isRed
										? 'border-red-900/10 text-red-900 hover:border-red-600'
										: 'border-slate-900 text-slate-800 hover:border-white'}"
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
