<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { user, logout } from '$lib/stores';
	import { page } from '$app/state';
	import Jackpot from '$lib/components/Jackpot.svelte';

	let { children } = $props();

	let isMenuOpen = $state(false);
	let isProfileMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleProfileMenu() {
		isProfileMenuOpen = !isProfileMenuOpen;
	}

	function handleLogout() {
		logout();
		isProfileMenuOpen = false;
	}

	const brainrotEmojis = [
		'🔥',
		'💀',
		'💸',
		'🤑',
		'💎',
		'🚀',
		'🤡',
		'👽',
		'👑',
		'🤌',
		'🍷',
		'🍌',
		'🍑',
		'🥵',
		'💦'
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>mijnfirda goksite - DE BESTE GOK SITE</title>
	<meta
		name="description"
		content="Oefen je gokverslaving bij mijnfirda goksite. Geen echt geld, wel de volledige ervaring. Hatsa!"
	/>
</svelte:head>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-[#050811] text-slate-100">
	<Jackpot />
	<!-- Sensory Overload Overlays (Subtler) -->
	<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 select-none">
		<div
			class="animate-flash-insane absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#7e22ce_0%,_transparent_60%)]"
		></div>
		{#each Array(50) as _, i}
			<div
				class="animate-float-crazy absolute text-6xl"
				style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; 
                       animation-delay: {Math.random() * 5}s; 
                       animation-duration: {5 + Math.random() * 5}s;
                       opacity: {0.1 + Math.random() * 0.4}"
			>
				{brainrotEmojis[Math.floor(Math.random() * brainrotEmojis.length)]}
			</div>
		{/each}
	</div>

	<!-- Top Bar -->
	<div
		class="relative z-50 bg-gradient-to-r from-red-600 via-yellow-400 to-purple-600 py-4 text-center text-xl font-black tracking-[0.4em] text-white uppercase italic"
	>
		🔥 MIJNFIRDA GOKSITE - GEEN SCHOOL, ALLEEN GECASH - HATSA HATSA HATSA 🔥
	</div>

	<!-- Navbar -->
	<nav class="sticky top-0 z-50 border-b border-purple-500/20 bg-[#050811]/95 backdrop-blur-xl">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-20 items-center justify-between">
				<!-- Logo -->
				<div class="flex items-center gap-4">
					<a href="/" class="group flex items-center gap-2">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-yellow-500 font-black text-white shadow-lg"
						>
							MG
						</div>
						<span class="text-2xl font-black tracking-tighter text-white uppercase italic">
							MIJNFIRDA<span class="text-[#fbbf24]">GOKSITE</span>
						</span>
					</a>
				</div>

				<!-- Desktop Menu -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-10">
						<a
							href="/"
							class="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
							>HOME</a
						>
						<a
							href="/games"
							class="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
							>SPELLEN</a
						>
						<a
							href="/promotions"
							class="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
							>CASHBACK 💸</a
						>
						<a
							href="/vip"
							class="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
							>VIP CLUB 👑</a
						>
					</div>
				</div>

				<!-- Live Gambled -->
				<div
					class="hidden flex-col items-center justify-center rounded-full border-4 border-yellow-500 bg-red-600 px-6 py-2 shadow-[0_0_30px_rgba(239,68,68,0.5)] md:flex"
				>
					<div class="text-[10px] font-black text-white uppercase italic">
						TOTAAL VERGOKT VANDAAG:
					</div>
					<div class="text-2xl font-black text-yellow-300">
						€{(12456789 + Math.random() * 100000).toLocaleString()}
					</div>
				</div>

				<!-- Auth / Profile -->
				<div class="hidden md:block">
					<div class="flex items-center space-x-6">
						{#if $user}
							<div class="relative">
								<button
									onclick={toggleProfileMenu}
									class="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-slate-900/50 p-1.5 pr-4 transition-all hover:bg-purple-500/10"
								>
									<div
										class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 font-bold text-white uppercase"
									>
										{$user.username[0]}
									</div>
									<div class="text-left">
										<div class="text-[10px] leading-none font-bold text-slate-400">
											{$user.username}
										</div>
										<div class="mt-1 text-xs leading-none font-black text-[#fbbf24]">
											€{$user.balance.toFixed(0)}
										</div>
									</div>
								</button>

								{#if isProfileMenuOpen}
									<div
										class="absolute right-0 z-50 mt-4 w-48 overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950 p-1 shadow-2xl backdrop-blur-xl"
									>
										<a
											href="/profile"
											class="block px-4 py-2 text-xs font-black text-slate-400 transition-colors hover:bg-purple-600 hover:text-white"
											>MIJN ACCOUNT</a
										>
										<a
											href="/settings"
											class="block px-4 py-2 text-xs font-black text-slate-400 transition-colors hover:bg-purple-600 hover:text-white"
											>INSTELLINGEN</a
										>
										<div class="my-1 border-t border-purple-500/10"></div>
										<button
											onclick={handleLogout}
											class="block w-full px-4 py-2 text-left text-xs font-black text-red-500 transition-colors hover:bg-red-500/10"
											>UITLOGGEN</button
										>
									</div>
								{/if}
							</div>
						{:else}
							<a
								href="/login"
								class="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
								>Inloggen</a
							>
							<a
								href="/signup"
								class="rounded-xl bg-[#fbbf24] px-6 py-2.5 text-xs font-black text-slate-950 uppercase shadow-lg shadow-yellow-500/10 transition-transform hover:scale-105"
								>GOKKEN NU</a
							>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main -->
	<main class="relative z-10 flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="z-50 border-t border-purple-500/20 bg-black pt-20 pb-12">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-16 md:grid-cols-4">
				<div class="col-span-1 md:col-span-1">
					<div class="mb-6 text-3xl font-black tracking-tighter text-white uppercase italic">
						MIJNFIRDA<span class="text-[#fbbf24]">GOKSITE</span>
					</div>
					<p
						class="text-[10px] leading-relaxed font-black tracking-widest text-slate-600 uppercase"
					>
						DIT IS GEEN ECHT CASINO. WE OEFENEN HIER GEWOON VOOR DE LEUK. GOKKEN MET NEP GELD, MAAR
						DE VERSLAVING IS ECHT. HATSA.
					</p>
				</div>
				<div>
					<h3 class="mb-8 text-[10px] font-black tracking-[0.5em] text-white uppercase">SPELLEN</h3>
					<ul class="space-y-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">
						<li>
							<a href="/games" class="transition-colors hover:text-purple-400">SLOTS VAN DE DOOD</a>
						</li>
						<li>
							<a href="/games" class="transition-colors hover:text-purple-400">FERDIN'S GEHEIMEN</a>
						</li>
						<li>
							<a href="/games" class="transition-colors hover:text-purple-400">CASH OVERLOAD</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-8 text-[10px] font-black tracking-[0.5em] text-white uppercase">
						GEEN HULP
					</h3>
					<ul class="space-y-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">
						<li>
							<a href="/" class="transition-colors hover:text-red-500">JE STAAT ER ALLEEN VOOR</a>
						</li>
						<li><a href="/" class="transition-colors hover:text-red-500">GEEN GELD TERUG FR</a></li>
						<li><a href="/" class="transition-colors hover:text-red-500">KONING'S WIL</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-8 text-[10px] font-black tracking-[0.5em] text-white uppercase">SOCIALS</h3>
					<div class="flex gap-4">
						{#each ['𝕏', 'IG', 'TT', 'YT'] as social}
							<div
								class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-500/20 bg-slate-900 text-sm font-black text-purple-400 transition-all hover:bg-purple-600 hover:text-white"
							>
								{social}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div
				class="mt-20 border-t border-slate-900 pt-10 text-center text-[10px] font-black tracking-[0.5em] text-slate-800 uppercase"
			>
				&copy; 2026 KONING FERDIN ENTERTAINMENT. AL JE VIRTUALE GELD IS VAN MIJ.
			</div>
		</div>
	</footer>
</div>
