<script lang="ts">
	import { onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';
	import { user } from '$lib/stores';

	let message = $state('');
	let chats = $state<{ username: string; text: string; timestamp: string }[]>([]);
	let socket: Socket;
	let chatContainer: HTMLElement;

	onMount(() => {
		socket = io(`http://${window.location.hostname}:3000`);

		socket.on('chatMessage', (data) => {
			chats = [...chats, data];
		});

		return () => {
			socket.disconnect();
		};
	});

	function sendMessage() {
		if (!$user || !message.trim()) return;

		socket.emit('message', {
			text: message,
			token: $user.token
		});
		message = '';
	}

	$effect(() => {
		if (chats.length && chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});
</script>

<div
	class="fixed right-6 bottom-24 z-[100] flex h-[500px] w-[400px] flex-col overflow-hidden rounded-[2rem] border-4 border-yellow-500 bg-black/95 shadow-[0_0_50px_rgba(251,191,36,0.5)] backdrop-blur-xl"
>
	<div
		class="border-b-4 border-yellow-500 bg-yellow-500 p-4 text-center text-lg font-black tracking-widest text-black uppercase"
	>
		GLOBAL FIRDA CHAT 🍷
	</div>

	<div bind:this={chatContainer} class="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
		{#each chats as chat}
			<div class="flex flex-col gap-1">
				<span class="text-[10px] font-black tracking-widest text-purple-500 uppercase"
					>{chat.username}</span
				>
				<div
					class="rounded-2xl border-2 border-slate-900 bg-slate-950 p-3 text-sm font-bold text-white shadow-lg"
				>
					{chat.text}
				</div>
			</div>
		{/each}
	</div>

	{#if $user}
		<div class="border-t-4 border-slate-900 p-4">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					sendMessage();
				}}
				class="flex gap-2"
			>
				<input
					type="text"
					bind:value={message}
					placeholder="Zeg iets stoers..."
					class="w-full rounded-xl border-2 border-slate-900 bg-black px-4 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
				/>
				<button
					type="submit"
					class="rounded-xl bg-yellow-500 px-4 py-2 font-black text-black transition-transform active:scale-90"
				>
					🚀
				</button>
			</form>
		</div>
	{:else}
		<div class="border-t-4 border-slate-900 p-4 text-center">
			<a href="/login" class="text-xs font-black text-yellow-500 uppercase italic underline">
				LOG IN OM TE CHATTEN JONGE
			</a>
		</div>
	{/if}
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
