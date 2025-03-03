-- create_users.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Store hashed passwords, not plain text!
    avatar_url TEXT DEFAULT NULL,
    location VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
