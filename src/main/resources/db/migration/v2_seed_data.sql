INSERT INTO users (username, password)
VALUES ('testuser', 'encoded-password');

INSERT INTO transactions (username, amount, type, category, description, date)
VALUES
('testuser', 10000, 'INCOME', 'Salary', 'Monthly salary', '2026-04-01'),
('testuser', 2000, 'EXPENSE', 'Food', 'Groceries', '2026-04-02');
