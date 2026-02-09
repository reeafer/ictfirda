<script lang="ts">
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
			id: 7,
			title: 'Book of Dead',
			category: 'Slots',
			color: 'from-yellow-600 to-amber-700',
			icon: '📖'
		},
		{
			id: 8,
			title: 'Starburst',
			category: 'Slots',
			color: 'from-fuchsia-600 to-purple-700',
			icon: '⭐'
		},
		{
			id: 9,
			title: "Gonzo's Quest",
			category: 'Slots',
			color: 'from-stone-500 to-stone-700',
			icon: '🗿'
		},
		{
			id: 10,
			title: 'Fire Joker',
			category: 'Slots',
			color: 'from-red-600 to-orange-600',
			icon: '🃏'
		}
	];
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-4xl font-black text-white">All Games</h1>

	<!-- Filters -->
	<div class="mb-8 flex gap-4 overflow-x-auto pb-4">
		<button class="rounded-full bg-emerald-600 px-6 py-2 font-bold whitespace-nowrap text-white"
			>All Games</button
		>
		<button
			class="rounded-full bg-slate-800 px-6 py-2 font-bold whitespace-nowrap text-slate-300 transition-colors hover:text-white"
			>Slots</button
		>
		<button
			class="rounded-full bg-slate-800 px-6 py-2 font-bold whitespace-nowrap text-slate-300 transition-colors hover:text-white"
			>Table Games</button
		>
		<button
			class="rounded-full bg-slate-800 px-6 py-2 font-bold whitespace-nowrap text-slate-300 transition-colors hover:text-white"
			>New</button
		>
		<button
			class="rounded-full bg-slate-800 px-6 py-2 font-bold whitespace-nowrap text-slate-300 transition-colors hover:text-white"
			>Popular</button
		>
	</div>

	<!-- Games Grid -->
	<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
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
		{#each games as game}
			<!-- Duplicate for demo filler -->
			<div class="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl">
				<div
					class="absolute inset-0 bg-gradient-to-br {game.color} opacity-80 transition-opacity duration-300 group-hover:opacity-100"
				></div>
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
