import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request) {
  const body = await request.json()
//   const { key, value } = body

  // Here you would typically save to a database
  // For now, we'll just log the data
  console.log('Received data:', body)

  // Simulate a delay as if we're saving to a database
  const query = `INSERT INTO public."resume" (name, role, tags, content) VALUES ($1, $2, $3, $4) RETURNING *`;
	const values = [body.name, body.role, body.tags, body.content];
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


