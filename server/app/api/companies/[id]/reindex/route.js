import { NextResponse } from "next/server";
import pool from '@/lib/db'
import * as cheerio from 'cheerio';

export async function POST(req, { params }) {
    const { id } = params;

    // const body = await req.json();

    let query = `SELECT * FROM public."company" WHERE id = $1`;
    let values = [id];
    let res = (await pool.query(query, values)).rows;
    if ( !res || res.length === 0) {
        return NextResponse.json({ error: `Company with ${id} not found` }, { status: 404 });
    }
    if( res[0].indexing === true) {
        return NextResponse.json({ error: 'Company is already being indexed' }, { status: 400 });
    }
    
    reIndex(res[0]);
    
    return NextResponse.json(res);
}

async function reIndex(company) {
    console.log("Reindexing company", company.name);
    let query = `DELETE FROM public."indexing" WHERE company_id = $1`;
    let values = [company.id];
    await pool.query(query, values);

    query = `UPDATE public."company" SET indexing = true WHERE id = $1 AND indexing = false RETURNING *`;
    values = [company.id];
    let res = (await pool.query(query, values)).rows;

    if( !res || res.length === 0) {
        return;
    }
    console.log("Indexing company", company.name);
  
    const pagesToIndex = [];
    const pagesToIndexMap = new Map();

    // Start with the company's start URL
    for( let i=1; ;i++){
        const pageLink = `${company.start_url}${i}`;
        console.log("Fetching page", pageLink);
        const { page, error } = await fetchPage(pageLink);
        if( error ) {
            console.log("Error fetching page", error);
            break;
        }
        const jobs = await getJobLinks(page, company);
        if( jobs.length === 0 ) {
            break;
        }
        for( const job of jobs ) {
            if( pagesToIndexMap.has(job) ) {
                continue;
            }
            pagesToIndex.push(job);
            pagesToIndexMap.set(job, true);
            let query = `INSERT INTO public."indexing" (company_id, page_link) VALUES ($1, $2) RETURNING *`;
            let values = [company.id, job];
            await pool.query(query, values);
        }
        pagesToIndexMap.set(pageLink, true);
        
    }
    console.log("Total pages to index", pagesToIndex.length); 
    
    while( pagesToIndex.length > 0) {
        const pageLink = pagesToIndex.pop();
        const { page, error } = await fetchPage(pageLink);
        if( error ) {
            console.log("Error fetching page", error);
            continue;
        }
        
        const jobData = await extractJobData(page, company);
        if( jobData ) {
            jobData.link = pageLink;
            saveJob(jobData, company);
            let query = `UPDATE public."indexing" SET status = 1 WHERE company_id = $1 AND page_link = $2`;
            let values = [company.id, pageLink];
            await pool.query(query, values);
        } else {
            let query = `UPDATE public."indexing" SET status = 2 WHERE company_id = $1 AND page_link = $2`;
            let values = [company.id, pageLink];
            await pool.query(query, values);
        }
    }
    console.log("Indexing complete");
    query = `UPDATE public."company" SET indexing = false WHERE id = $1 RETURNING *`;
    values = [company.id];
    await pool.query(query, values).rows;
}

async function fetchPage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        return { page:data };
    } catch (error) {
        return { error };
    }
}

async function extractJobData(page , company) {
    const $ = cheerio.load(page);
    const title = $(company.title_selector).text();
    let location = $(company.location_selector).text();
    let experience = $(company.experience_selector).text();
    const content = $(company.content_selector).text();
    
    if ( !title || !content ) {
        return null;
    }
    if ( !location ) {
        location = "";
    }
    if ( !experience ) {
        experience = "";
    }
    return { title, location, experience, content };
}

async function getJobLinks(page, company) {
    const $ = cheerio.load(page);
    company.job_link_selector = company.job_link_selector || '.WpHeLc.VfPpkd-mRLv6.VfPpkd-RLmnJb';
    const links = $(company.job_link_selector);

    const jobLinks = [];
    for( const link of links ) {
        const href = $(link).attr('href');
        if( href.startsWith("http") ) {
            jobLinks.push(href);
        } else {
            jobLinks.push(company.base_url + href);
        }
    }
    return jobLinks;
}

async function saveJob(job, company) {
    
    let query = `SELECT * FROM public."job" WHERE link = $1`;
    let values = [job.link];
    let res = (await pool.query(query, values)).rows;
    if( res.length > 0 ) {
        return;
    }
    let embedding = await getEmbedding(job.content);
    query = `INSERT INTO public."job" (title, location, experience, content, link, embedding, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    values = [job.title, job.location, job.experience, job.content, job.link, embedding, company.id];
    const { rows } = await pool.query(query, values);
    return rows;
}

// export async function GET(req, { params }) {
//     const { id } = params;
//     const body = await req.json();

//     if (!id) {
//         return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//     }

//     const query = `UPDATE public."company" SET name = $1, start_url = $2, base_url = $3, title_selector = $4, location_selector = $5, experience_selector = $6, content_selector = $7 WHERE id = $8 RETURNING *`;
//     const values = [body.name, body.start_url, body.base_url, body.title_selector, body.location_selector, body.experience_selector, body.content_selector, id];
//     const { rows } = await pool.query(query, values);
    
//     return NextResponse.json(rows);
// }

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


export async function GET(req, { params }) {
    const { id } = params;

    // const body = await req.json();
    let query = `SELECT * FROM public."company" WHERE id = $1`;
    let values = [id];
    let res = (await pool.query(query, values)).rows;
    if ( !res || res.length === 0) {
        return NextResponse.json({ error: `Company with ${id} not found` }, { status: 404 });
    }
    let data = {};
    if( res[0].indexing === true) {
        data.indexing = true;
    } else {
        data.indexing = false;
    }

    query = `SELECT * FROM public."indexing" WHERE company_id = $1 ORDER BY created_at DESC`;
    values = [id];
    res = (await pool.query(query, values)).rows;
    console.log("habijabi", res.length);
    data.pages = res;
    return NextResponse.json(data);
}