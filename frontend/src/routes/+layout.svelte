<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { user, logout } from '$lib/stores';
	import { page } from '$app/state';

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>FirdaBet - Premium Gambling</title>
	<meta name="description" content="The best place to win big in Firda." />
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-slate-900 text-white selection:bg-emerald-500 selection:text-white"
>
	<!-- Navbar -->
	<nav class="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a
						href="/"
						class="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-2xl font-black tracking-tighter text-transparent"
					>
						FIRDABET
					</a>
				</div>

				<!-- Desktop Menu -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-8">
						<a
							href="/"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-400"
							>Home</a
						>
						<a
							href="/games"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-400"
							>Games</a
						>
						<a
							href="/live"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-400"
							>Live Casino</a
						>
						<a
							href="/promotions"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-400"
							>Promotions</a
						>
						<a
							href="/vip"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-400"
							>VIP</a
						>
					</div>
				</div>

				<!-- Auth / Profile Buttons -->
				<div class="hidden md:block">
					<div class="ml-4 flex items-center space-x-4 md:ml-6">
						{#if $user}
							<div class="relative">
								<button
									onclick={toggleProfileMenu}
									class="flex items-center gap-3 text-sm focus:outline-none"
								>
									<div class="hidden text-right lg:block">
										<div class="font-bold text-white">{$user.username}</div>
										<div class="font-mono text-emerald-400">€{$user.balance.toFixed(2)}</div>
									</div>
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold"
									>
										{$user.username[0].toUpperCase()}
									</div>
								</button>

								{#if isProfileMenuOpen}
									<div
										class="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-xl border border-white/10 bg-slate-800 py-1 shadow-lg ring-1 ring-black"
									>
										<a
											href="/profile"
											class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
											>Your Profile</a
										>
										<a
											href="/settings"
											class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
											>Settings</a
										>
										<button
											onclick={handleLogout}
											class="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 hover:text-red-300"
											>Sign out</button
										>
									</div>
								{/if}
							</div>
						{:else}
							<a
								href="/login"
								class="text-sm font-medium text-slate-300 transition-colors hover:text-white"
								>Log In</a
							>
							<a
								href="/signup"
								class="transform rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-500 hover:to-emerald-300"
							>
								Sign Up
							</a>
						{/if}
					</div>
				</div>

				<!-- Mobile menu button -->
				<div class="-mr-2 flex md:hidden">
					<button
						onclick={toggleMenu}
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<div class="border-b border-white/10 bg-slate-900 md:hidden">
				<div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
					<a href="/" class="block rounded-md px-3 py-2 text-base font-medium text-white">Home</a>
					<a
						href="/games"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
						>Games</a
					>
					<a
						href="/live"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
						>Live Casino</a
					>
					<a
						href="/promotions"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
						>Promotions</a
					>
				</div>
				<div class="border-t border-slate-700 pt-4 pb-4">
					{#if $user}
						<div class="mb-4 flex items-center px-5">
							<div class="flex-shrink-0">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold"
								>
									{$user.username[0].toUpperCase()}
								</div>
							</div>
							<div class="ml-3">
								<div class="text-base leading-none font-medium text-white">{$user.username}</div>
								<div class="mt-1 text-sm leading-none font-medium text-emerald-400">
									€{$user.balance.toFixed(2)}
								</div>
							</div>
						</div>
						<button
							onclick={handleLogout}
							class="block w-full px-5 py-2 text-left text-base font-medium text-red-400 hover:bg-slate-800 hover:text-white"
							>Sign out</button
						>
					{:else}
						<div class="flex items-center space-x-4 px-5">
							<a
								href="/login"
								class="w-full rounded-lg border border-slate-600 py-2 text-center text-slate-300"
								>Log In</a
							>
							<a
								href="/signup"
								class="w-full rounded-lg bg-emerald-500 py-2 text-center font-bold text-white"
								>Sign Up</a
							>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main class="flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-white/5 bg-slate-950 pt-12 pb-8">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
				<div>
					<h3 class="mb-4 font-bold text-white">Casino</h3>
					<ul class="space-y-2 text-sm text-slate-400">
						<li><a href="#" class="hover:text-emerald-400">Slots</a></li>
						<li><a href="#" class="hover:text-emerald-400">Live Casino</a></li>
						<li><a href="#" class="hover:text-emerald-400">Table Games</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">Support</h3>
					<ul class="space-y-2 text-sm text-slate-400">
						<li><a href="#" class="hover:text-emerald-400">Help Center</a></li>
						<li><a href="#" class="hover:text-emerald-400">Contact Us</a></li>
						<li><a href="#" class="hover:text-emerald-400">Fair Play</a></li>
						<li><a href="#" class="hover:text-emerald-400">Responsible Gambling</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">About</h3>
					<ul class="space-y-2 text-sm text-slate-400">
						<li><a href="#" class="hover:text-emerald-400">About FirdaBet</a></li>
						<li><a href="#" class="hover:text-emerald-400">Affiliates</a></li>
						<li><a href="#" class="hover:text-emerald-400">Terms of Service</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">Payment Methods</h3>
					<div class="flex space-x-2 text-2xl text-slate-500">
						<!-- Placeholders for payment icons -->
						<div class="h-6 w-10 rounded bg-slate-800"></div>
						<div class="h-6 w-10 rounded bg-slate-800"></div>
						<div class="h-6 w-10 rounded bg-slate-800"></div>
					</div>
					<p class="mt-4 text-xs text-slate-500">18+ | Play Responsibly</p>
				</div>
			</div>
			<div class="border-t border-white/5 pt-8 text-center text-sm text-slate-600">
				&copy; 2026 FirdaBet. All rights reserved.
			</div>
		</div>
	</footer>
</div>
