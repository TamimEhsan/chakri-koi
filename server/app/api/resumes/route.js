import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request) {
  const body = await request.json()
  console.log('Received data:', body)

  let embedding = await getEmbedding(body.content);

  const query = `INSERT INTO public."resume" (name, role, tags, content, embedding) VALUES ($1, $2, $3, $4) RETURNING *`;
	const values = [body.name, body.role, body.tags, body.content, embedding];
	const { rows } = await pool.query(query, values);
	console.log(rows);

  return NextResponse.json({ message: 'Data received successfully' })
}

// get all resumes
export async function GET() {
  console.log('GET')
  const query = `SELECT * FROM public."resume"`;
  const { rows } = await pool.query(query);
  return NextResponse.json(rows);
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