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
    job_link_selector TEXT,
    indexing BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now()
);

INSERT INTO company (name, start_url, base_url, title_selector, location_selector, experience_selector, content_selector, job_link_selector) 
VALUES (
    'Google',
    'https://www.google.com/about/careers/applications/jobs/results?q=%22Software%20Engineer%22&location=Poland&target_level=MID&target_level=EARLY&page=',
    'https://www.google.com/about/careers/applications/',
    '.p1N2lc',
    'div.op1BBf:nth-child(2) > span:nth-child(2) > span:nth-child(2)',
    'div.op1BBf:nth-child(2) > div:nth-child(3) > span:nth-child(1) > div:nth-child(1) > button:nth-child(1) > span:nth-child(5) > span:nth-child(1)',
    '.DkhPwc',
    '.WpHeLc.VfPpkd-mRLv6.VfPpkd-RLmnJb'
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