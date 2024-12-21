import pool from '@/lib/db';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import fs from 'fs';
export async function POST(request) {
  let body = await request.json()

  /*
  CREATE TABLE IF NOT EXISTS job (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES company(id),
    title TEXT,
    location TEXT,
    experience TEXT,
    tags TEXT,
    content TEXT,
    embeddings VECTOR
);
*/
    if (body.link && body.link.includes('http')) {
        body = await parseLink(body);
    }
    console.log(body.title, body.location, body.experience);
    // save the job to the file system
    fs.writeFileSync('job.txt', body.content);

    return NextResponse.json({ message: 'Data received successfully' });
    let embedding = await getEmbedding(body.content);
    const query = `INSERT INTO public."job" (company_id, title, location, experience, tags, content, embedding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [body.company_id, body.title, body.location, body.experience, body.tags, body.content, embedding];
    await pool.query(query, values);
	
    return NextResponse.json({ message: 'Data received successfully' })
}

async function parseLink(body) {
    const url = new URL(body.link);
    // get the http page of the link
    const response = await fetch(url.href);
    const query = `SELECT * FROM public."company" WHERE id = $1`;
    const values = [body.company_id];
    const { rows } = await pool.query(query, values);
    if ( !rows || rows.length === 0) {
        return NextResponse.json([]);
    }
    const company = rows[0];

    // get the title of the page using css selector;
    console.log(`'${company.title_selector}'`);
    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);
    // save to a file
    body.title = $(company.title_selector).text();
    body.location = $(company.location_selector).text();
    body.experience = $(company.experience_selector).text();
    body.content = $(company.content_selector).text();
    
    return body;
}

async function getEmbedding(content) {
    const response = await fetch('http://localhost:8000/encode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: content })
    });
    const data = await response.json();
    let embedding = data.embedding.join(',');
    embedding = `[${embedding}]`;
    return embedding;
  }
