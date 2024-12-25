import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// get a job
export async function GET(req, { params }) {
    const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

    const query = `SELECT job.*, company.name as company FROM public."job" JOIN company ON company.id = job.company_id WHERE job.id = $1`;
    const values = [id];
    const { rows } = await pool.query(query, values);
    if ( !rows || rows.length === 0) {
        return NextResponse.json([]);
    }
    return NextResponse.json(rows[0]);
}

// update resume
export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const query = `UPDATE public."job" SET title = $1, location = $2, experience = $3, tags = $4, content = $5 WHERE id = $6 RETURNING *`;
    const values = [body.title, body.location, body.experience, body.tags, body.content, id];
    const { rows } = await pool.query(query, values);
    
    return NextResponse.json(rows);
}
