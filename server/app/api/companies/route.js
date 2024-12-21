import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request) {
  const body = await request.json()

  // Simulate a delay as if we're saving to a database
    const query = `INSERT INTO public."company" (name, start_url, base_url, title_selector, location_selector, experience_selector, content_selector) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
	const values = [body.name, body.start_url, body.base_url, body.title_selector, body.location_selector, body.experience_selector, body.content_selector];
    await pool.query(query, values);
	// make a call to http://0.0.0.0:8000/encode with {text: body.content} to get the embeddings
    // const embed_res = await fetch('http://0.0.0.0:8000/encode', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({text: body.content}),
    // });
    // const embed_data = await embed_res.json();
    // console.log(embed_data);
    return NextResponse.json({ message: 'Data received successfully' })
}

// get all resumes
export async function GET() {
  console.log('GET')
  const query = `SELECT id, name FROM public."company"`;
  const { rows } = await pool.query(query);
  return NextResponse.json(rows);
}


