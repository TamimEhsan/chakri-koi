import { NextResponse } from 'next/server'
import pool from '@/lib/db'


export async function GET() {
    // Get all resumes
    let query = `SELECT id, name, role FROM public."resume"`;
    let { rows } = await pool.query(query);
    
    const resumes = [];
    for( const row of rows ) {
        let resume = {
            id: row.id,
            name: row.name,
            role: row.role,
            tags: row.tags,
        };
        query = `
            SELECT 
                job.id, job.title, job.location, job.experience, job.tags, job.link, job.created_at, 
                company.name, 
                1 - (job.embedding <=> resume.embedding) AS similarity
            FROM job 
            JOIN company ON job.company_id = company.id
            JOIN resume on resume.id = $1
            ORDER BY similarity DESC
            LIMIT 10
            ;
        `
        let values = [resume.id];
        const { rows } = await pool.query(query, values);
        resume.jobs = rows;
        resumes.push(resume);
    }
    return NextResponse.json(resumes);
}

export async function POST(request) {
    const body = await request.json();
    // wait a bit
    const original_text = body.userInput;
    console.log(original_text);
    const response = await fetch('http://localhost:8000/rewrite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: original_text })
    });
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
}


