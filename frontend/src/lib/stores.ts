import { writable } from 'svelte/store';

// Mock user type
export interface User {
    id: number;
    username: string;
    balance: number;
    isAdmin: boolean;
    token?: string;
}

// Store for the current user (null if not logged in)
// Initialize from localStorage if possible (browser only)
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('firda_user') : null;
const initialUser = storedUser ? JSON.parse(storedUser) : null;

// If we have a user but no separate token in localStorage, set it
if (typeof window !== 'undefined' && initialUser?.token) {
    const existingToken = localStorage.getItem('token');
    if (!existingToken) {
        localStorage.setItem('token', initialUser.token);
    }
}

export const user = writable<User | null>(initialUser);

// Function to login (update store)
export const login = (data: any) => {
    // data is { user: User, access_token: string } from our new API
    const fullUser = { ...data.user, token: data.access_token };
    user.set(fullUser);
    if (typeof window !== 'undefined') {
        localStorage.setItem('firda_user', JSON.stringify(fullUser));
        // Also store token separately for game pages
        localStorage.setItem('token', data.access_token);
    }
};

// Function to logout
export const logout = () => {
    user.set(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('firda_user');
        localStorage.removeItem('token');
    }
};

// Store for shared bets
export interface Bet {
    id: number;
    user: string;
    amount: string;
    game: string;
    multiplier?: string;
}

export const recentBets = writable<Bet[]>([
    { id: 1, user: 'FirdaKing99', amount: '€5,420', game: 'Mega Moolah' },
    { id: 2, user: 'LuckyLisa', amount: '€1,200', game: 'Starburst' },
    { id: 3, user: 'PokerFace_X', amount: '€8,500', game: "Texas Hold'em" },
    { id: 4, user: 'GroningenGold', amount: '€250', game: 'Roulette' }
]);

export const addBet = (bet: Bet) => {
    recentBets.update(bets => [bet, ...bets.slice(0, 9)]);
};
