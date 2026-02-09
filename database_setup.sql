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

-- 4. Create a Default Admin User (password: admin123)
-- Note: In a real app, use a proper password hash (e.g. bcrypt)
INSERT INTO users (username, password_hash, balance, is_admin) 
VALUES ('admin', 'admin123_hash_placeholder', 100000.00, TRUE);
