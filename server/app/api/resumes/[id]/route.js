import { NextResponse } from 'next/server'
import pool from '@/lib/db'


// get all resumes
export async function GET(req, { params }) {
    const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
    console.log('GET')
    const query = `SELECT * FROM public."resume" WHERE id = $1`;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows);
}

// update resume
export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    // console.log('PUT')
    // console.log(body)
    // return NextResponse.json({ message: 'Data received successfully' });
    const query = `UPDATE public."resume" SET name = $1, role = $2, tags = $3, content = $4 WHERE id = $5 RETURNING *`;
    const values = [body.name, body.role, body.tags, body.content, id];
    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows);
}