import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getEmbedding(content) {
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