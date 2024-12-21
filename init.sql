CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS KEY_VALUE (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS resume (
    id SERIAL PRIMARY KEY,
    name TEXT,
    role TEXT,
    tags TEXT,
    content TEXT,
    embeddings VECTOR
);

CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    name TEXT,
    start_url TEXT,
    base_url TEXT,
    title_selector TEXT,
    location_selector TEXT,
    experience_selector TEXT,
    content_selector TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES company(id),
    title TEXT,
    location TEXT,
    experience TEXT,
    tags TEXT,
    content TEXT,
    link TEXT UNIQUE,
    embeddings VECTOR,
    created_at TIMESTAMP DEFAULT now()
);