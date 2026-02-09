<script lang="ts">
	import { onMount } from 'svelte';
	import { user, recentBets, addBet } from '$lib/stores';
	import type { Bet } from '$lib/stores';

	// Subscribe to the store
	let winners = $state<Bet[]>([]);

	// Svelte 5 rune subscription
	$effect(() => {
		winners = $recentBets;
	});

	// Mock games
	const games = [
		{
			id: 1,
			title: 'Gates of Firda',
			category: 'Slots',
			color: 'from-purple-600 to-indigo-600',
			icon: '⚡'
		},
		{
			id: 2,
			title: 'Royal Blackjack',
			category: 'Table',
			color: 'from-emerald-600 to-teal-600',
			icon: '♠️'
		},
		{
			id: 3,
			title: 'Speed Roulette',
			category: 'Live',
			color: 'from-red-600 to-rose-600',
			icon: '🎡'
		},
		{
			id: 4,
			title: 'Sweet Bonanza',
			category: 'Slots',
			color: 'from-pink-500 to-rose-500',
			icon: '🍭'
		},
		{
			id: 5,
			title: 'Firda Poker',
			category: 'Table',
			color: 'from-blue-600 to-cyan-600',
			icon: '🃏'
		},
		{
			id: 6,
			title: 'Crazy Time',
			category: 'Live',
			color: 'from-amber-500 to-orange-500',
			icon: '🎲'
		}
	];

	// Betting form state
	let betAmount = $state('');
	let selectedGameId = $state(games[0].id);

	// --- COMMUNITY / ADMIN BETTING LOGIC ---
	interface BettingEvent {
		id: number;
		title: string;
		optionA: string;
		optionB: string;
		poolA: number;
		poolB: number;
		status: 'OPEN' | 'CLOSED';
	}

	// Default active events (Mock DB)
	let events = $state<BettingEvent[]>([
		{
			id: 1,
			title: 'Gaat Ferdi slagen?',
			optionA: 'Ja, natuurlijk',
			optionB: 'Nee, helaas',
			poolA: 500,
			poolB: 120,
			status: 'OPEN'
		}
	]);

	// Admin Panel State
	let newEventTitle = $state('');
	let newOptionA = $state('');
	let newOptionB = $state('');

	function createEvent(e: Event) {
		e.preventDefault();
		if (!newEventTitle || !newOptionA || !newOptionB) return;

		events = [
			{
				id: Date.now(),
				title: newEventTitle,
				optionA: newOptionA,
				optionB: newOptionB,
				poolA: 0,
				poolB: 0,
				status: 'OPEN'
			},
			...events
		];

		// Reset form
		newEventTitle = '';
		newOptionA = '';
		newOptionB = '';
		alert('Betting Event Created Successfully!');
	}

	// User Betting on Event
	let eventBetAmount = $state('');

	function placeEventBet(event: BettingEvent, choice: 'A' | 'B') {
		if (!$user) {
			alert('Please log in first!');
			return;
		}

		const amount = parseFloat(eventBetAmount);
		if (!amount || amount <= 0) {
			alert('Please enter a valid amount');
			return;
		}

		if (amount > $user.balance) {
			alert('Insufficient balance!');
			return;
		}

		// Update pools (mock logic)
		const eventIndex = events.findIndex((e) => e.id === event.id);
		if (eventIndex !== -1) {
			if (choice === 'A') events[eventIndex].poolA += amount;
			else events[eventIndex].poolB += amount;
		}

		// Add to recent ticker
		addBet({
			id: Date.now(),
			user: $user.username,
			amount: `€${amount}`,
			game: event.title + ` (${choice === 'A' ? event.optionA : event.optionB})`
		});

		alert(`Bet placed on ${choice === 'A' ? event.optionA : event.optionB} for €${amount}!`);
		eventBetAmount = '';
	}
	// ---------------------------------------

	function placeBet(e: Event) {
		e.preventDefault();

		if (!$user) return;

		const game = games.find((g) => g.id === selectedGameId);

		const newBet: Bet = {
			id: Date.now(),
			user: $user.username,
			amount: `€${betAmount}`,
			game: game ? game.title : 'Unknown Game'
		};

		addBet(newBet);

		// Reset form
		betAmount = '';
		alert('Bet placed successfully! Good luck!');
	}

	onMount(() => {
		const interval = setInterval(() => {
			const randomGame = games[Math.floor(Math.random() * games.length)];
			const newWinner = {
				id: Date.now(),
				user: `User${Math.floor(Math.random() * 1000)}`,
				amount: `€${Math.floor(Math.random() * 5000)}`,
				game: randomGame.title
			};
			addBet(newWinner);
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<!-- Hero Section -->
<div class="relative overflow-hidden">
	<!-- Background Glows -->
	<div
		class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-full -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]"
	></div>
	<div
		class="pointer-events-none absolute top-20 right-0 h-[300px] w-1/3 rounded-full bg-purple-500/20 blur-[100px]"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 pt-20 pb-24 text-center sm:px-6 md:text-left lg:px-8">
		<div class="grid items-center gap-12 md:grid-cols-2">
			<div>
				{#if $user}
					<span
						class="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wide text-emerald-400 uppercase"
					>
						Welcome back, {$user.username}
					</span>
					<h1 class="mb-6 text-4xl leading-tight font-black tracking-tight text-white md:text-6xl">
						Ready to place <br />
						<span
							class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
							>your next bet?</span
						>
					</h1>

					<!-- Quick Bet Form -->
					<div
						class="mx-auto max-w-md rounded-2xl border border-white/5 bg-slate-800/50 p-6 backdrop-blur-sm md:mx-0"
					>
						<h3 class="mb-4 font-bold text-white">Quick Bet</h3>
						<form onsubmit={placeBet} class="space-y-4">
							<div>
								<label for="game" class="mb-1 block text-sm font-medium text-slate-400">Game</label>
								<select
									id="game"
									bind:value={selectedGameId}
									class="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500"
								>
									{#each games as game}
										<option value={game.id}>{game.title}</option>
									{/each}
								</select>
							</div>
							<div>
								<label for="amount" class="mb-1 block text-sm font-medium text-slate-400"
									>Amount</label
								>
								<div class="relative rounded-md shadow-sm">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<span class="text-slate-500 sm:text-sm">€</span>
									</div>
									<input
										type="number"
										name="amount"
										id="amount"
										bind:value={betAmount}
										required
										min="1"
										class="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-7 text-white focus:border-emerald-500 focus:ring-emerald-500"
										placeholder="0.00"
									/>
								</div>
							</div>
							<button
								type="submit"
								class="w-full rounded-lg bg-emerald-500 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
							>
								Place Bet
							</button>
						</form>
					</div>
				{:else}
					<span
						class="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wide text-emerald-400 uppercase"
					>
						Welcome Bonus
					</span>
					<h1 class="mb-6 text-5xl leading-tight font-black tracking-tight text-white md:text-7xl">
						Play Big. <br />
						<span
							class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
							>Win (N)Bigger.</span
						>
					</h1>
					<p class="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-slate-400 md:mx-0">
						Experience the thrill of the next generation casino. Get a 100% deposit bonus up to €500
						on your first deposit.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
						<a
							href="/signup"
							class="transform rounded-xl bg-emerald-500 px-8 py-4 text-center text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 hover:bg-emerald-400"
						>
							Join Now
						</a>
						<a
							href="/games"
							class="rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 text-center text-lg font-bold text-white transition-all hover:border-slate-600 hover:bg-slate-700"
						>
							View Games
						</a>
					</div>
				{/if}
			</div>

			<!-- Hero Visual -->
			<div class="relative mt-10 hidden md:mt-0 md:block">
				<div
					class="relative z-10 grid rotate-6 transform grid-cols-2 gap-4 transition-transform duration-700 hover:rotate-0"
				>
					<div
						class="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
					>
						<div class="mb-4 text-4xl">🎰</div>
						<div class="text-xl font-bold text-white">Slots</div>
						<div class="text-sm text-slate-400">2,000+ Games</div>
					</div>
					<div
						class="mt-8 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
					>
						<div class="mb-4 text-4xl">🎲</div>
						<div class="text-xl font-bold text-white">Live Casino</div>
						<div class="text-sm text-slate-400">Real Dealers</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- COMMUNITY / ADMIN BETTING SECTION -->
<div class="relative overflow-hidden border-y border-white/5 bg-slate-900 py-12">
	<div class="pointer-events-none absolute inset-0 bg-emerald-900/10"></div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-10 text-center">
			<h2 class="mb-2 text-3xl font-black text-white md:text-4xl">Live Community Bets</h2>
			<p class="font-medium text-emerald-400">Place your bets on the hottest topics.</p>
		</div>

		{#if $user}
			<!-- ADMIN PANEL -->
			{#if $user.isAdmin}
				<div
					class="mb-12 rounded-2xl border border-emerald-500/50 bg-slate-800/80 p-6 shadow-xl shadow-emerald-900/20"
				>
					<div class="mb-6 flex items-center gap-3">
						<span class="rounded bg-emerald-500 px-2 py-1 text-xs font-black text-slate-900"
							>ADMIN</span
						>
						<h3 class="text-xl font-bold text-white">Create New Event</h3>
					</div>
					<form onsubmit={createEvent} class="grid items-end gap-4 md:grid-cols-4">
						<div class="md:col-span-2">
							<label for="title" class="mb-1 block text-sm font-medium text-slate-400"
								>Event Question</label
							>
							<input
								type="text"
								id="title"
								bind:value={newEventTitle}
								placeholder="e.g. Will Feyenoord win?"
								class="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
							/>
						</div>
						<div>
							<label for="optA" class="mb-1 block text-sm font-medium text-slate-400"
								>Option 1 (Pro)</label
							>
							<input
								type="text"
								id="optA"
								bind:value={newOptionA}
								placeholder="Yes / Happens"
								class="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
							/>
						</div>
						<div>
							<label for="optB" class="mb-1 block text-sm font-medium text-slate-400"
								>Option 2 (Contra)</label
							>
							<input
								type="text"
								id="optB"
								bind:value={newOptionB}
								placeholder="No / Wont Happen"
								class="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
							/>
						</div>
						<button
							type="submit"
							class="w-full rounded-lg bg-emerald-600 py-3 font-bold text-white shadow-lg transition-colors hover:bg-emerald-500 md:col-span-4"
						>
							🚀 Launch Event
						</button>
					</form>
				</div>
			{/if}

			<!-- ACTIVE EVENTS LIST -->
			<div class="grid gap-8 md:grid-cols-2">
				{#each events as event}
					<div
						class="overflow-hidden rounded-2xl border border-white/10 bg-slate-800 transition-colors hover:border-emerald-500/50"
					>
						<div class="p-6">
							<div class="mb-4 flex items-start justify-between">
								<h3 class="text-xl font-bold text-white">{event.title}</h3>
								<span
									class="rounded bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-400 uppercase"
									>Live</span
								>
							</div>

							<div class="mb-6 grid grid-cols-2 gap-4">
								<button
									onclick={() => placeEventBet(event, 'A')}
									class="group relative rounded-xl border border-slate-600 bg-slate-700 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-900/30"
								>
									<div class="mb-1 text-sm text-slate-400">Option A</div>
									<div class="text-lg font-bold text-white group-hover:text-emerald-400">
										{event.optionA}
									</div>
									<div class="mt-2 font-mono text-xs text-emerald-500">Pool: €{event.poolA}</div>
								</button>
								<button
									onclick={() => placeEventBet(event, 'B')}
									class="group relative rounded-xl border border-slate-600 bg-slate-700 p-4 transition-all hover:border-red-500/50 hover:bg-red-900/30"
								>
									<div class="mb-1 text-sm text-slate-400">Option B</div>
									<div class="text-lg font-bold text-white group-hover:text-red-400">
										{event.optionB}
									</div>
									<div class="mt-2 font-mono text-xs text-red-500">Pool: €{event.poolB}</div>
								</button>
							</div>

							<div class="flex items-center gap-4">
								<div class="relative flex-grow">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<span class="text-slate-500">€</span>
									</div>
									<input
										type="number"
										bind:value={eventBetAmount}
										placeholder="Your wager..."
										class="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-8 text-white focus:border-emerald-500 focus:ring-emerald-500"
									/>
								</div>
								<span class="text-xs text-slate-500">Select an option above to bet</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- LOGGED OUT STATE FOR EVENTS -->
			<div class="rounded-2xl border border-white/5 bg-slate-800/50 p-8 text-center">
				<p class="mb-4 text-lg text-slate-300">
					Log in to view active community bets and place your wagers.
				</p>
				<a
					href="/login"
					class="inline-block rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white transition-colors hover:bg-emerald-500"
					>Log In to Bet</a
				>
			</div>
		{/if}
	</div>
</div>

<!-- Live Winners Ticker -->
<div class="relative overflow-hidden border-y border-white/5 bg-slate-950/50 py-4">
	<div class="mx-auto flex max-w-7xl items-center gap-4 px-4">
		<div class="flex items-center gap-2 font-bold whitespace-nowrap text-emerald-400">
			<span class="relative flex h-3 w-3">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
				></span>
				<span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
			</span>
			LATEST ACTION
		</div>
		<div class="mask-linear-gradient flex-1 overflow-hidden">
			<div class="slide-track flex gap-8">
				{#each winners as winner (winner.id)}
					<div class="flex items-center gap-2 text-sm whitespace-nowrap">
						<span class="font-medium text-slate-300">{winner.user}</span>
						<span class="text-slate-500">bet</span>
						<span class="font-bold text-emerald-400">{winner.amount}</span>
						<span class="text-slate-600">on {winner.game}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Game Categories -->
<div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<div class="mb-10 flex items-end justify-between">
		<div>
			<h2 class="mb-2 text-3xl font-bold text-white">Popular Games</h2>
			<p class="text-slate-400">The most played games this week at FirdaBet</p>
		</div>
		<a href="/games" class="hidden font-medium text-emerald-400 hover:text-emerald-300 sm:block"
			>View all games &rarr;</a
		>
	</div>

	<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
		{#each games as game}
			<div class="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl">
				<!-- Background Gradient -->
				<div
					class="absolute inset-0 bg-gradient-to-br {game.color} opacity-80 transition-opacity duration-300 group-hover:opacity-100"
				></div>

				<!-- Content -->
				<div class="absolute inset-0 flex flex-col justify-between p-6">
					<div
						class="transform text-4xl drop-shadow-lg filter transition-transform duration-300 group-hover:scale-110"
					>
						{game.icon}
					</div>
					<div>
						<span class="text-xs font-bold tracking-wider text-white/80 uppercase"
							>{game.category}</span
						>
						<h3 class="mt-1 text-lg leading-tight font-bold text-white">{game.title}</h3>
					</div>
				</div>

				<!-- Hover Overlay -->
				<div
					class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				>
					<div
						class="translate-y-4 transform rounded-full bg-white p-3 text-black shadow-xl transition-transform duration-300 group-hover:translate-y-0"
					>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"
							><path
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
							/></svg
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Features Section -->
<div class="border-t border-white/5 bg-slate-900 py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-12 text-center md:grid-cols-3">
			<div
				class="rounded-3xl border border-white/5 bg-slate-800/50 p-6 transition-colors hover:bg-slate-800"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl"
				>
					🚀
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">Instant Payouts</h3>
				<p class="text-slate-400">
					Winning feels better when you get your money instantly. We process 99% of withdrawals in
					under 5 minutes.
				</p>
			</div>
			<div
				class="rounded-3xl border border-white/5 bg-slate-800/50 p-6 transition-colors hover:bg-slate-800"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl"
				>
					🛡️
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">Secure & Fair</h3>
				<p class="text-slate-400">
					Licensed and regulated using the latest encryption technology. All games are provably
					fair.
				</p>
			</div>
			<div
				class="rounded-3xl border border-white/5 bg-slate-800/50 p-6 transition-colors hover:bg-slate-800"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-3xl"
				>
					💎
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">VIP Rewards</h3>
				<p class="text-slate-400">
					Join the Firda Club. Get exclusive bonuses, personal account managers, and luxury gifts.
				</p>
			</div>
		</div>
	</div>
</div>
