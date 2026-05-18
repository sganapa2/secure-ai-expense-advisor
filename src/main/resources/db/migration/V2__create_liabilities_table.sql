CREATE TABLE liabilities (
    id BIGSERIAL PRIMARY KEY,

    username VARCHAR(100) NOT NULL,

    liability_name VARCHAR(255),

    total_amount NUMERIC(12,2) NOT NULL,

    paid_amount NUMERIC(12,2) DEFAULT 0,

    remaining_amount NUMERIC(12,2) NOT NULL,

    borrowed_from VARCHAR(255),

    repayment_source VARCHAR(255),

    status VARCHAR(20),

    start_date DATE,

    due_date DATE,

    notes TEXT
);

CREATE INDEX idx_liability_user
ON liabilities(username);