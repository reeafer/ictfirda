<script lang="ts">
    import { user, login } from '$lib/stores';
    import { goto } from '$app/navigation';

    let username = $state('');
    let email = $state('');
    let password = $state('');
    let loading = $state(false);

    function handleSignup(e: Event) {
        e.preventDefault();
        loading = true;
        
        // Simulate API call
        setTimeout(() => {
            login(username);
            loading = false;
            goto('/');
        }, 1500);
    }
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-slate-800/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
                Create your account
            </h2>
            <p class="mt-2 text-center text-sm text-slate-400">
                Already have an account?
                <a href="/login" class="font-medium text-emerald-400 hover:text-emerald-300">
                    Log in
                </a>
            </p>
        </div>
        <form class="mt-8 space-y-6" onsubmit={handleSignup}>
            <div class="rounded-md shadow-sm space-y-4">
                <div>
                    <label for="username" class="sr-only">Username</label>
                    <input id="username" name="username" type="text" required bind:value={username} class="appearance-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-slate-700" placeholder="Username">
                </div>
                <div>
                    <label for="email" class="sr-only">Email address</label>
                    <input id="email" name="email" type="email" required bind:value={email} class="appearance-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-slate-700" placeholder="Email address">
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input id="password" name="password" type="password" required bind:value={password} class="appearance-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-slate-700" placeholder="Password">
                </div>
            </div>

            <div class="flex items-center">
                <input id="terms" name="terms" type="checkbox" required class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-600 rounded bg-slate-700">
                <label for="terms" class="ml-2 block text-sm text-slate-400">
                    I agree to the <a href="#" class="text-emerald-400 hover:text-emerald-300">Terms of Service</a> and <a href="#" class="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>
                </label>
            </div>

            <div>
                <button type="submit" disabled={loading} class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {#if loading}
                        Creating Account...
                    {:else}
                        Get Started
                    /if}
                </button>
            </div>
        </form>
    </div>
</div>
