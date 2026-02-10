-- 1. Create the Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 1000.00,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the Betting Events Table
CREATE TABLE betting_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    option_a VARCHAR(50) NOT NULL, -- e.g. "Gebeurd"
    option_b VARCHAR(50) NOT NULL, -- e.g. "Gebeurt niet"
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, CLOSED, RESOLVED
    winning_option VARCHAR(10) DEFAULT NULL, -- 'A' or 'B'
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the User Bets Table
CREATE TABLE user_bets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    event_id INT REFERENCES betting_events(id),
    amount DECIMAL(10, 2) NOT NULL,
    choice VARCHAR(10) NOT NULL, -- 'A' or 'B'
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the Games Table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'slots', 'blackjack', 'roulette', 'poker'
    min_bet DECIMAL(10, 2) DEFAULT 1.00,
    max_bet DECIMAL(10, 2) DEFAULT 1000.00,
    rtp DECIMAL(5, 2) DEFAULT 96.00, -- Return to Player percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create the Game Sessions Table
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    game_id INT REFERENCES games(id),
    bet_amount DECIMAL(10, 2) NOT NULL,
    win_amount DECIMAL(10, 2) DEFAULT 0.00,
    game_data JSONB, -- Store game-specific data (e.g., cards dealt, reel results)
    result VARCHAR(20) NOT NULL, -- 'WIN', 'LOSS', 'PUSH'
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create the User Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'BET', 'WIN'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insert Casino Games
INSERT INTO games (name, type, min_bet, max_bet, rtp) VALUES
('Gates of Firda', 'slots', 0.10, 100.00, 96.50),
('Royal Blackjack', 'blackjack', 1.00, 500.00, 99.50),
('European Roulette', 'roulette', 0.50, 1000.00, 97.30),
('Firda Poker', 'poker', 1.00, 200.00, 98.00),
('Sweet Bonanza', 'slots', 0.20, 100.00, 96.48),
('Book of Dead', 'slots', 0.10, 100.00, 96.21),
('Starburst', 'slots', 0.10, 100.00, 96.09),
('Gonzo''s Quest', 'slots', 0.20, 50.00, 95.97),
('Fire Joker', 'slots', 0.05, 100.00, 96.15),
('Mega Fortune', 'slots', 0.25, 50.00, 96.60);

-- 8. Create a Default Admin User (password: admin123)
-- Note: In a real app, use a proper password hash (e.g. bcrypt)
INSERT INTO users (username, password_hash, balance, is_admin) 
VALUES ('admin', 'admin123_hash_placeholder', 100000.00, TRUE);
