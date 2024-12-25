import { NextResponse } from 'next/server'
import pool from '@/lib/db'


// get all resumes
export async function GET(req, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

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

    let embedding = await getEmbedding(body.content);

    const query = `UPDATE public."resume" SET name = $1, role = $2, tags = $3, content = $4, embedding = $5 WHERE id = $6 RETURNING *`;
    const values = [body.name, body.role, body.tags, body.content, embedding, id];
    const { rows } = await pool.query(query, values);
    if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Data updated successfully' });
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