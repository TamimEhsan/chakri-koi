import { NextResponse } from 'next/server'
import pool from '@/lib/db'


// get all resumes
export async function GET(req, { params }) {
    const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
    console.log('GET')
    const query = `SELECT * FROM public."company" WHERE id = $1`;
    const values = [id];
    let { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    const company = rows[0];

    const queryJob = `SELECT id, title, location, experience, tags FROM public."job" WHERE company_id = $1`;
    const valuesJob = [id];
    const rowsJob  = (await pool.query(queryJob, valuesJob)).rows; 

    console.log("rows::",rowsJob); 
    console.log("id::",id);
    if( !rowsJob || rowsJob.length === 0) company.jobs = [];
    else company.jobs = rowsJob;
    console.log(company.jobs.length);
    return NextResponse.json(company);
}

// update resume
export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const query = `UPDATE public."company" SET name = $1, start_url = $2, base_url = $3, title_selector = $4, location_selector = $5, experience_selector = $6, content_selector = $7 WHERE id = $8 RETURNING *`;
    const values = [body.name, body.start_url, body.base_url, body.title_selector, body.location_selector, body.experience_selector, body.content_selector, id];
    const { rows } = await pool.query(query, values);
    
    return NextResponse.json(rows);
}