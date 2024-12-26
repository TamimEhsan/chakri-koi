import { NextResponse } from 'next/server'



export async function POST(request) {
    const body = await request.json();
    // wait a bit
    const original_text = body.userInput;
    console.log(original_text);
    const response = await fetch('http://localhost:8000/correct', {
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


