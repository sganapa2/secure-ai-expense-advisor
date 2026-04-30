-- USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

-- TRANSACTION TABLE
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    amount NUMERIC(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    date DATE NOT NULL,
    -- Investment-specific fields
    maturity_date DATE,
    investment_institute VARCHAR(255),
    investment_platform VARCHAR(255)
);

-- INDEX (important for your queries)
CREATE INDEX idx_user_date ON transactions(username, date);