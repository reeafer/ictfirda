<script lang="ts">
	import { onMount } from 'svelte';
	import { user, recentBets, addBet } from '$lib/stores';
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
		return () => clearInterval(interval);
	});
</script>

<!-- Hero Section -->
<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-32"
>
	<!-- Extreme Background (Subtler) -->
	<div class="absolute inset-0 z-0">
		<div
			class="h-full w-full bg-[radial-gradient(circle_at_center,_#7e22ce_0%,_#000_80%)] opacity-20"
		></div>
		<div
			class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
		></div>
	</div>

	<!-- Chaotic Graphs (Subtler) -->
	<div class="absolute top-24 left-10 hidden h-64 w-96 opacity-20 lg:block">
		<svg viewBox="0 0 150 100" class="h-full w-full overflow-visible">
			<polyline
				fill="none"
				stroke="#fbbf24"
				stroke-width="2"
				points={chartData.map((v, i) => `${i * 5},${100 - v}`).join(' ')}
			/>
		</svg>
		<div class="mt-4 text-[10px] font-black tracking-[0.5em] text-[#fbbf24] uppercase">
			GOK METER 📈
		</div>
	</div>

	<div class="relative z-10 max-w-5xl text-center">
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-600/10 px-6 py-3 backdrop-blur-xl"
		>
			<span class="animate-bounce text-2xl">🔥</span>
			<span class="text-xs font-black tracking-[0.3em] text-white uppercase"
				>KONING FERDIN'S GOK PARADIJS</span
			>
		</div>

		<h1
			class="animate-shake-slow mb-10 text-7xl leading-none font-black tracking-tighter text-white uppercase italic md:text-[10rem]"
		>
			GOKKEN <br />
			<span
				class="bg-gradient-to-r from-red-500 via-yellow-500 to-purple-600 bg-clip-text text-transparent italic"
				>IS LEUK.</span
			>
		</h1>

		<p
			class="mx-auto mb-16 max-w-3xl text-xl leading-tight font-black tracking-tight text-slate-500 uppercase"
		>
			SCHOOL IS VOOR MENSEN DIE NIET DURVEN TE GOKKEN. HIER OEFENEN WE OM <span class="text-white"
				>KEIHARD</span
			>
			TE WINNEN (OF TE VERLIEZEN). GEEN ECHT GELD, MAAR WEL DE
			<span class="text-[#fbbf24]">VOLLEDIGE ERVARING</span>. HATSA!
		</p>

		<div class="flex flex-wrap justify-center gap-8">
			<a
				href="/games"
				class="group relative overflow-hidden rounded-[2rem] bg-[#fbbf24] px-14 py-8 text-2xl font-black text-slate-950 uppercase shadow-lg shadow-yellow-500/10 transition-transform hover:scale-105 active:scale-95"
			>
				<span class="relative z-10">NU SPELEN 💸</span>
				<div
					class="absolute inset-0 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0"
				></div>
			</a>
			<button
				onclick={() =>
					document.getElementById('event-creator')?.scrollIntoView({ behavior: 'smooth' })}
				class="rounded-[2rem] border-2 border-purple-600 bg-black px-14 py-8 text-2xl font-black text-purple-400 uppercase transition-all hover:bg-purple-600 hover:text-white"
			>
				MAAK CHAOS
			</button>
		</div>
	</div>

	<!-- Floating Sensations -->
	<div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center opacity-30">
		<div class="text-[10px] font-black tracking-[1em] text-slate-700 uppercase">
			GOKKEN GOKKEN GOKKEN
		</div>
	</div>
</div>

<!-- Event Creator -->
<div
	id="event-creator"
	class="relative overflow-hidden border-y border-purple-900/30 bg-[#050811] py-32"
>
	<div class="relative mx-auto max-w-2xl px-4">
		<div class="mb-16 text-center">
			<div class="mb-4 text-[10px] font-black tracking-[0.5em] text-[#fbbf24] uppercase">
				HET COMMANDO VAN DE KONING
			</div>
			<h2 class="text-5xl font-black tracking-tighter text-white uppercase italic">
				MAAK JE EIGEN <span class="text-[#fbbf24]">WEDSTRIJD</span>
			</h2>
		</div>

		<form
			onsubmit={createEvent}
			class="relative space-y-8 rounded-[3rem] border border-purple-900/30 bg-black p-10 shadow-2xl"
		>
			<div>
				<label
					for="etitle"
					class="mb-4 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
					>WAAR GAAN WE OP WEDDEN?</label
				>
				<input
					id="etitle"
					bind:value={newEventTitle}
					placeholder="bijv. Ferdin koopt een nieuwe tuinstoel"
					class="w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-8 py-6 text-xl font-black text-white focus:border-[#fbbf24] focus:outline-none"
					required
				/>
			</div>
			<div class="grid grid-cols-2 gap-6">
				<div>
					<label
						for="opA"
						class="mb-4 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>OPTIE A (W)</label
					>
					<input
						id="opA"
						bind:value={newEventOptionA}
						placeholder="HATSA"
						class="w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-8 py-6 text-xl font-black text-white focus:border-purple-600 focus:outline-none"
						required
					/>
				</div>
				<div>
					<label
						for="opB"
						class="mb-4 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>OPTIE B (L)</label
					>
					<input
						id="opB"
						bind:value={newEventOptionB}
						placeholder="BROKKO"
						class="w-full rounded-2xl border-2 border-slate-900 bg-slate-950 px-8 py-6 text-xl font-black text-white focus:border-purple-600 focus:outline-none"
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				disabled={creatingEvent}
				class="group relative w-full overflow-hidden rounded-2xl bg-purple-600 py-6 text-xl font-black tracking-widest text-white uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
			>
				<span class="relative z-10">{creatingEvent ? 'BEZIG...' : 'GOOI HET ONLINE 🚀'}</span>
			</button>
		</form>
	</div>
</div>

<!-- Community Bets -->
<div class="bg-black py-32">
	<div class="mx-auto max-w-7xl px-4">
		<div class="mb-24 text-center">
			<span
				class="mb-6 inline-block text-[10px] font-black tracking-[0.6em] text-[#fbbf24] uppercase"
				>LIVE FEED</span
			>
			<h2 class="text-6xl font-black tracking-tighter text-white uppercase italic">
				WEDDENSCHAPPEN <span class="text-[#fbbf24]">NU LIVE</span>
			</h2>
		</div>

		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
			{#each events as event}
				<div
					class="group relative overflow-hidden rounded-[3rem] border border-slate-900 bg-[#0a0a0a] p-10 shadow-xl transition-all hover:border-purple-600"
				>
					<div class="mb-10">
						<span
							class="rounded-full border border-purple-500/20 bg-purple-900/20 px-4 py-2 text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase"
							>FERDIN-WAGER</span
						>
						<h3 class="mt-8 text-2xl leading-tight font-black text-white uppercase italic">
							{event.title}
						</h3>
					</div>

					<div class="space-y-8">
						<input
							type="number"
							bind:value={eventAmounts[event.id]}
							placeholder="BEDRAG..."
							class="w-full rounded-2xl border-2 border-slate-900 bg-black px-8 py-5 text-lg font-black text-white placeholder:text-slate-800 focus:border-[#fbbf24] focus:outline-none"
						/>

						<div class="grid grid-cols-2 gap-4">
							<button
								onclick={() => placeEventBet(event, 'A')}
								class="rounded-2xl bg-purple-600 py-5 text-xs font-black text-white uppercase transition-all hover:bg-purple-500 active:scale-90"
							>
								{event.optionA}
							</button>
							<button
								onclick={() => placeEventBet(event, 'B')}
								class="rounded-2xl border border-slate-800 bg-slate-900 py-5 text-xs font-black text-slate-500 uppercase transition-all hover:bg-slate-800 active:scale-90"
							>
								{event.optionB}
							</button>
						</div>
					</div>

					<div class="mt-10 flex items-center justify-between border-t border-slate-900 pt-8">
						<div class="text-[10px] font-black tracking-widest text-slate-700 uppercase italic">
							TOTAAL IN DE POT
						</div>
						<div class="text-2xl font-black text-[#fbbf24]">
							€{event.poolA + event.poolB}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Winners Ticker -->
<div class="overflow-hidden border-y border-yellow-500/30 bg-purple-900 py-6">
	<div class="animate-scroll flex gap-20 text-xl font-black text-white uppercase italic">
		{#each Array(2) as _}
			<div class="flex items-center gap-6 whitespace-nowrap text-yellow-300">
				<span>KONING FERDIN IS IN HET GEBOUW 🌍 HATSA!</span>
				<span class="text-white">||</span>
				<span class="text-white">NIET VOOR SCHOOL, MAAR VOOR HET GECASH 🔥</span>
				<span class="text-white">||</span>
			</div>
			{#each winners as winner}
				<div class="flex items-center gap-6 whitespace-nowrap">
					<span>{winner.user}</span>
					<span class="text-yellow-400">TAS IS GEVULD 💸</span>
					<span class="rounded-xl bg-white px-4 py-1 text-black shadow-lg">{winner.amount}</span>
					<span class="text-purple-300">BIJ {winner.game}</span>
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	.animate-scroll {
		display: flex;
		width: max-content;
		animation: scroll 20s linear infinite;
	}
</style>
