<script lang="ts">
	import { onMount } from 'svelte';

	let active = $state(false);
	let amount = $state(0);

	function trigger() {
		amount = Math.floor(Math.random() * 1000000);
		active = true;
		setTimeout(() => {
			active = false;
		}, 3000);
	}

	onMount(() => {
		const interval = setInterval(() => {
			if (Math.random() > 0.95) {
				trigger();
			}
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

{#if active}
	<div
		class="animate-shake-extreme fixed inset-0 z-[10000] flex items-center justify-center bg-yellow-500/80 outline-[20px] outline-white backdrop-blur-3xl outline-double"
	>
		<div class="text-center">
			<h1 class="scale-150 animate-bounce text-9xl font-black text-black uppercase italic">
				🚨 JACKPOT 🚨<br />
				<span class="animate-gok-text">€{amount.toLocaleString()}</span><br />
				HATSAAAAA!
			</h1>
			<div class="mt-10 flex justify-center gap-10">
				{#each Array(10) as _}
					<span class="animate-float-crazy text-8xl">💸</span>
				{/each}
			</div>
		</div>
	</div>
{/if}
