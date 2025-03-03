-- seed_users.sql
INSERT INTO users (username, name, email, password_hash, avatar_url, location) VALUES
('testuser1', 'Test User One', 'test1@example.com', '$2b$10$EXAMPLEHASH', NULL, 'New York'),
('testuser2', 'Test User Two', 'test2@example.com', '$2b$10$EXAMPLEHASH', NULL, 'London');
