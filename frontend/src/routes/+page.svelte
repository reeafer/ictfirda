<script lang="ts">
	import { onMount } from 'svelte';
	import { user, recentBets, addBet } from '$lib/stores';
	import Chat from '$lib/components/Chat.svelte';
	import type { Bet } from '$lib/stores';

	let winners = $state<Bet[]>([]);
	$effect(() => {
		winners = $recentBets;
	});

	// Mock data for graphs - MOVED FASTER
	let chartData = $state(
		Array(30)
			.fill(0)
			.map(() => Math.random() * 100)
	);
	onMount(() => {
		const interval = setInterval(() => {
			chartData = [...chartData.slice(1), Math.random() * 100];
		}, 100); // RAMPED UP SPEED
		return () => clearInterval(interval);
	});

	const games = [
		{ id: 1, title: 'SLOTS OF DOOM', category: 'BRAINROT', color: 'bg-purple-600', icon: '💀' },
		{ id: 2, title: 'SIGMA JACK', category: 'HUSTLE', color: 'bg-pink-600', icon: '🍷' },
		{ id: 3, title: 'WHEEL OF PAIN', category: 'GAMBLE', color: 'bg-yellow-500', icon: '🎡' }
	];

	let events = $state<any[]>([]);
	let eventAmounts = $state<Record<number, string>>({});

	// Create Event Form
	let newEventTitle = $state('');
	let newEventOptionA = $state('');
	let newEventOptionB = $state('');
	let creatingEvent = $state(false);

	async function fetchEvents() {
		try {
			const res = await fetch(`http://${window.location.hostname}:3000/events`);
			events = await res.json();
		} catch (e) {
			console.error('Failed to fetch events', e);
		}
	}

	async function createEvent(e: Event) {
		e.preventDefault();
		if (!$user || !$user.token) return alert('EERST INLOGGEN JONGEN');
		creatingEvent = true;
		try {
			const res = await fetch(`http://${window.location.hostname}:3000/events`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$user.token}`
				},
				body: JSON.stringify({
					title: newEventTitle,
					optionA: newEventOptionA,
					optionB: newEventOptionB
				})
			});
			if (res.ok) {
				newEventTitle = '';
				newEventOptionA = '';
				newEventOptionB = '';
				fetchEvents();
				alert('EVENT AANGEMAAKT FR FR HATSA');
			}
		} catch (e) {
			alert('SERVER L + GEEN INTERNET');
		} finally {
			creatingEvent = false;
		}
	}

	async function placeEventBet(event: any, choice: 'A' | 'B') {
		if (!$user || !$user.token) return alert('INLOGGEN OF GA WEG');
		const amount = parseFloat(eventAmounts[event.id] || '0');
		if (amount <= 0) return alert('VOER EEN BEDRAG IN NO CAP');

		try {
			const res = await fetch(`http://${window.location.hostname}:3000/bet`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$user.token}`
				},
				body: JSON.stringify({ eventId: event.id, option: choice, amount })
			});
			const result = await res.json();
			if (result.success) {
				user.update((u) => (u ? { ...u, balance: result.newBalance } : null));
				alert(`BET GEPLAATST! KONING FERDIN IS TROTS. HATSA!`);
				eventAmounts[event.id] = '';
				fetchEvents();
			} else {
				alert('FOUTJE BEDANKT: ' + result.message);
			}
		} catch (e) {
			alert('SERVER IS STUK');
		}
	}

	let chips = $state<{ id: number; x: number; y: number; emoji: string; delay: number }[]>([]);

	onMount(() => {
		fetchEvents();
		const interval = setInterval(() => {
			const randomGame = games[Math.floor(Math.random() * games.length)];
			addBet({
				id: Date.now(),
				user: `Gokker${Math.floor(Math.random() * 999)}`,
				amount: `€${(Math.random() * 500).toFixed(0)}`,
				game: randomGame.title
			});
		}, 3000);

		// Generate floating chips
		chips = Array(15)
			.fill(0)
			.map((_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				emoji: ['💸', '🎰', '🤡', '🤑', '🎲', '🔥', '🍷', '💀'][Math.floor(Math.random() * 8)],
				delay: Math.random() * 5
			}));

		return () => clearInterval(interval);
	});
</script>

<!-- Gamble Overlay -->
<div class="gamba-overlay opacity-20">
	<div class="animate-flash-insane absolute inset-0"></div>
</div>

<!-- Floating Brainrot -->
{#each chips as chip}
	<div
		class="floating-chip animate-float-crazy z-0"
		style="left: {chip.x}%; top: {chip.y}%; animation-delay: {chip.delay}s"
	>
		{chip.emoji}
	</div>
{/each}

<!-- Hero Section -->
<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-32"
>
	<!-- Extreme Background -->
	<div class="absolute inset-0 z-0">
		<div
			class="h-full w-full bg-[radial-gradient(circle_at_center,_#7e22ce_0%,_#000_80%)] opacity-40"
		></div>
		<div
			class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
		></div>
		<div
			class="animate-shake-extreme absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-yellow-500/20"
		></div>
	</div>

	<!-- Chaotic Graphs -->
	<div class="absolute top-24 left-10 hidden h-64 w-96 opacity-40 lg:block">
		<svg viewBox="0 0 150 100" class="h-full w-full overflow-visible">
			<polyline
				fill="none"
				stroke="#fbbf24"
				stroke-width="4"
				points={chartData.map((v, i) => `${i * 5},${100 - v}`).join(' ')}
				class="animate-pulse"
			/>
		</svg>
		<div
			class="animate-gok-text mt-4 text-2xl font-black tracking-[0.5em] text-[#fbbf24] uppercase"
		>
			GOK METER 📈 MAX!!
		</div>
	</div>

	<div class="relative z-10 max-w-5xl text-center">
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-2xl border-4 border-yellow-500 bg-purple-600/30 px-6 py-3 backdrop-blur-xl"
		>
			<span class="animate-bounce text-4xl">🔥</span>
			<span class="text-xl font-black tracking-[0.3em] text-white uppercase">MIJNFIRDA GOKSITE</span
			>
			<span class="animate-bounce text-4xl">🔥</span>
		</div>

		<h1
			class="mb-10 text-7xl leading-none font-black tracking-tighter text-white uppercase italic md:text-[12rem]"
		>
			<span class="animate-gok-text">GOKKEN</span> <br />
			<span
				class="bg-gradient-to-r from-red-600 via-yellow-400 to-purple-600 bg-clip-text text-transparent italic drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]"
				>IS LEUK.</span
			>
		</h1>

		<p
			class="mx-auto mb-16 max-w-3xl text-3xl leading-tight font-black tracking-tight text-white uppercase"
		>
			SCHOOL IS VOOR MENSEN DIE NIET DURVEN TE GOKKEN. HIER OEFENEN WE OM <span
				class="bg-yellow-500 px-4 text-black">KEIHARD</span
			>
			TE WINNEN. GEEN ECHT GELD, MAAR WEL DE
			<span class="animate-gok-text text-[#fbbf24]">VOLLEDIGE ERVARING</span>. HATSA!
		</p>

		<div class="flex flex-wrap justify-center gap-8">
			<a
				href="/games"
				class="group relative animate-bounce overflow-hidden rounded-[2rem] border-8 border-white bg-[#fbbf24] px-14 py-8 text-4xl font-black text-slate-950 uppercase shadow-[0_0_50px_rgba(251,191,36,0.8)] transition-transform hover:scale-110 active:scale-95"
			>
				<span class="relative z-10">NU SPELEN 💸 HATSA!</span>
				<div
					class="absolute inset-0 translate-y-full bg-white/40 transition-transform group-hover:translate-y-0"
				></div>
			</a>
			<button
				onclick={() =>
					document.getElementById('event-creator')?.scrollIntoView({ behavior: 'smooth' })}
				class="animate-pulse rounded-[2rem] border-4 border-purple-600 bg-black px-14 py-8 text-3xl font-black text-purple-400 uppercase transition-all hover:bg-purple-600 hover:text-white"
			>
				MAAK CHAOS 🤡
			</button>
		</div>
	</div>

	<!-- Floating Sensations -->
	<div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center opacity-80">
		<div class="animate-gok-text text-2xl font-black tracking-[1em] text-white uppercase">
			GOKKEN GOKKEN GOKKEN
		</div>
	</div>
</div>

<!-- Event Creator -->
<div
	id="event-creator"
	class="relative overflow-hidden border-y-8 border-yellow-500 bg-[#050811] py-32"
>
	<div class="animate-flash-insane absolute inset-0 opacity-10"></div>
	<div class="relative mx-auto max-w-2xl px-4">
		<div class="mb-16 text-center">
			<div
				class="mb-4 animate-bounce text-2xl font-black tracking-[0.5em] text-[#fbbf24] uppercase"
			>
				HET COMMANDO VAN DE KONING 👑
			</div>
			<h2
				class="animate-shake-extreme text-6xl font-black tracking-tighter text-white uppercase italic"
			>
				MAAK JE EIGEN <span class="text-[#fbbf24]">CHAOS</span>
			</h2>
		</div>

		<form
			onsubmit={createEvent}
			class="animate-tilt relative space-y-8 rounded-[3rem] border-4 border-purple-500 bg-black p-10 shadow-[0_0_100px_rgba(126,34,206,0.3)]"
		>
			<div>
				<label
					for="etitle"
					class="mb-4 block text-xl font-black tracking-widest text-[#fbbf24] uppercase"
					>WAAR GAAN WE OP WEDDEN?</label
				>
				<input
					id="etitle"
					bind:value={newEventTitle}
					placeholder="bijv. Ferdin gaat huilen bij de les"
					class="w-full rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-2xl font-black text-white focus:border-[#fbbf24] focus:outline-none"
					required
				/>
			</div>
			<div class="grid grid-cols-2 gap-6">
				<div>
					<label
						for="opA"
						class="mb-4 block text-lg font-black tracking-widest text-slate-500 uppercase"
						>OPTIE A (W)</label
					>
					<input
						id="opA"
						bind:value={newEventOptionA}
						placeholder="HATSA"
						class="w-full rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-xl font-black text-white focus:border-purple-600 focus:outline-none"
						required
					/>
				</div>
				<div>
					<label
						for="opB"
						class="mb-4 block text-lg font-black tracking-widest text-slate-500 uppercase"
						>OPTIE B (L)</label
					>
					<input
						id="opB"
						bind:value={newEventOptionB}
						placeholder="BROKKO"
						class="w-full rounded-2xl border-4 border-slate-900 bg-slate-950 px-8 py-6 text-xl font-black text-white focus:border-purple-600 focus:outline-none"
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				disabled={creatingEvent}
				class="animate-brainrot group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-8 text-3xl font-black tracking-widest text-white uppercase transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50"
			>
				<span class="relative z-10">{creatingEvent ? 'BEZIG...' : 'GOOI HET ONLINE 🚀 HATSA!'}</span
				>
			</button>
		</form>
	</div>
</div>

<!-- Community Bets -->
<div class="bg-black py-32">
	<div class="mx-auto max-w-7xl px-4">
		<div class="mb-24 text-center">
			<span
				class="animate-gok-text mb-6 inline-block text-2xl font-black tracking-[0.6em] text-[#fbbf24] uppercase"
				>LIVE FEED VAN DE CHAOS</span
			>
			<h2
				class="animate-shake-slow text-8xl font-black tracking-tighter text-white uppercase italic"
			>
				WEDDENSCHAPPEN <span class="text-[#fbbf24]">NU LIVE</span>
			</h2>
		</div>

		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
			{#each events as event}
				<div
					class="animate-tilt group relative overflow-hidden rounded-[3rem] border-4 border-slate-900 bg-[#0a0a0a] p-10 shadow-2xl transition-all hover:border-yellow-500"
				>
					<div class="mb-10">
						<span
							class="animate-pulse rounded-full border-2 border-purple-500 bg-purple-900/40 px-6 py-3 text-sm font-black tracking-[0.2em] text-white uppercase"
							>FERDIN-WAGER 🔥</span
						>
						<h3
							class="animate-gok-text mt-8 text-4xl leading-tight font-black text-white uppercase italic"
						>
							{event.title}
						</h3>
					</div>

					<div class="space-y-8">
						<input
							type="number"
							bind:value={eventAmounts[event.id]}
							placeholder="HOEVEEL???"
							class="w-full rounded-2xl border-4 border-slate-900 bg-black px-8 py-5 text-2xl font-black text-white placeholder:text-slate-800 focus:border-[#fbbf24] focus:outline-none"
						/>

						<div class="grid grid-cols-2 gap-4">
							<button
								onclick={() => placeEventBet(event, 'A')}
								class="animate-bounce rounded-2xl bg-purple-600 py-6 text-xl font-black text-white uppercase transition-all hover:bg-purple-500 active:scale-90"
							>
								{event.optionA}
							</button>
							<button
								onclick={() => placeEventBet(event, 'B')}
								class="rounded-2xl border-4 border-slate-800 bg-slate-900 py-6 text-xl font-black text-slate-500 uppercase transition-all hover:bg-slate-800 active:scale-90"
							>
								{event.optionB}
							</button>
						</div>
					</div>

					<div class="mt-10 flex items-center justify-between border-t-4 border-slate-900 pt-8">
						<div class="text-sm font-black tracking-widest text-[#fbbf24] uppercase italic">
							DE POT IS GEVULD:
						</div>
						<div class="animate-flash text-4xl font-black text-white">
							€{event.poolA + event.poolB}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Chat Implementation -->
<Chat />

<!-- Winners Ticker -->
<div class="animate-shake-extreme overflow-hidden border-y-8 border-yellow-500 bg-purple-900 py-10">
	<div class="animate-scroll-fast flex gap-20 text-4xl font-black text-white uppercase italic">
		{#each Array(2) as _}
			<div class="flex items-center gap-10 whitespace-nowrap text-yellow-300">
				<span>KONING FERDIN IS IN HET GEBOUW 🌍 HATSA!</span>
				<span class="text-white">||</span>
				<span class="animate-gok-text text-white">NIET VOOR SCHOOL, MAAR VOOR HET GECASH 🔥</span>
				<span class="text-white">||</span>
			</div>
			{#each winners as winner}
				<div class="flex items-center gap-10 whitespace-nowrap">
					<span class="animate-bounce text-pink-400">{winner.user}</span>
					<span class="text-yellow-400">TAS IS GEVULD 💸</span>
					<span class="animate-shake-extreme rounded-xl bg-white px-8 py-2 text-black shadow-2xl"
						>{winner.amount}</span
					>
					<span class="text-purple-300">BIJ {winner.game}</span>
				</div>
			{/each}
		{/each}
	</div>
</div>

<!-- BRAINROT CAROUSELS -->
<div class="space-y-32 overflow-hidden bg-black py-32">
	<!-- Carousel 1: Random Wins -->
	<div class="relative">
		<h2 class="mb-10 text-center text-4xl font-black tracking-widest text-white uppercase italic">
			RECENTE <span class="text-yellow-500">TAS-VULLINGEN</span> 💸
		</h2>
		<div class="animate-scroll-fast flex gap-10">
			{#each Array(20) as _}
				<div
					class="flex h-64 w-80 shrink-0 flex-col items-center justify-center gap-4 rounded-[2rem] border-4 border-slate-900 bg-[#050505] p-8 transition-transform hover:scale-110"
				>
					<div class="text-6xl">🤑</div>
					<div class="text-2xl font-black text-white uppercase">
						€{Math.floor(Math.random() * 10000)}
					</div>
					<div class="text-[10px] font-black text-slate-500 uppercase">DOOR EEN ECHTE STRIJDER</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Carousel 2: Random Memes/Shit -->
	<div class="relative">
		<h2 class="mb-10 text-center text-4xl font-black tracking-widest text-white uppercase italic">
			DE <span class="text-purple-600">SIGMA</span> COLLECTIE 🗿
		</h2>
		<div class="animate-scroll-fast-reverse flex gap-10">
			{#each Array(20) as _}
				<div
					class="flex h-64 w-80 shrink-0 flex-col items-center justify-center gap-4 rounded-[2rem] border-4 border-purple-900 bg-[#050505] p-8 transition-transform hover:rotate-6"
				>
					<div class="text-6xl">
						{['🗿', '🍷', '🔥', '💀', '🤡', '👑'][Math.floor(Math.random() * 6)]}
					</div>
					<div class="text-center text-xl font-black text-purple-400 uppercase">
						GEEN L + GEEN RATIO
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="spinning-chaos">🎰</div>

<style>
	.spinning-chaos {
		position: fixed;
		bottom: 20px;
		left: 20px;
		width: 100px;
		height: 100px;
		background: conic-gradient(red, yellow, blue, green, purple, orange, red);
		border-radius: 50%;
		border: 8px solid white;
		animation: spin 0.5s linear infinite;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
	}
	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes scroll-fast-reverse {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(0);
		}
	}
	.animate-scroll-fast-reverse {
		display: flex;
		width: max-content;
		animation: scroll-fast-reverse 15s linear infinite;
	}
</style>
