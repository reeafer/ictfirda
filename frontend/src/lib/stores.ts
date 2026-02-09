import { writable } from 'svelte/store';

// Mock user type
export interface User {
    username: string;
    balance: number;
}

// Store for the current user (null if not logged in)
export const user = writable<User | null>(null);

// Mock function to login
export const login = (username: string) => {
    user.set({
        username,
        balance: 1000 // Give them some starting money
    });
};

// Mock function to logout
export const logout = () => {
    user.set(null);
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
