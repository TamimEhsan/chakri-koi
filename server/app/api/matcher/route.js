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


