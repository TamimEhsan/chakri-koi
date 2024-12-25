import { NextResponse } from "next/server";
import { getEmbedding } from '@/lib/utils'
import pool from "@/lib/db";

export async function POST(request, { params }) {
  let body = await request.json()
    if (body.link && body.link.includes('http')) {
        body = await parseLink(body);
    }
    
    if (!body.userInput) return NextResponse.json({ similarity: 0.00 });
    let embeddings = await getEmbedding(body.userInput);

    const query1 = `SELECT 1 - (embedding <=> $1) AS similarity FROM public."job" WHERE id = $2`;
    const values1 = [embeddings, params.id];
    const { rows } = await pool.query(query1, values1);
    if ( !rows || rows.length === 0) return NextResponse.json({ similarity: 0.00 });
    return NextResponse.json({ similarity: rows[0].similarity });
    let embedding = await getEmbedding(body.content);
    const query = `INSERT INTO public."job" (company_id, title, location, experience, tags, content, embedding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [body.company_id, body.title, body.location, body.experience, body.tags, body.content, embedding];
    await pool.query(query, values);
    
    return NextResponse.json({ message: 'Data received successfully' })
}