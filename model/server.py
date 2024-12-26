from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from transformers import pipeline
import language_tool_python
import numpy as np

# Initialize the embedding model
model = SentenceTransformer('paraphrase-MPNet-base-v2')

# Initialize the grammar correction model
corrector = pipeline(
    'text2text-generation',
    model='pszemraj/flan-t5-large-grammar-synthesis',
)

# Initialize the LanguageTool instance
tool = language_tool_python.LanguageTool('en-US')

# FastAPI app
app = FastAPI()

class TextInput(BaseModel):
    text: str


@app.post("/encode")
async def encode(input: TextInput):
    embeddings = model.encode([input.text])
    return {"embedding": embeddings[0].tolist()}

# Helper function to split text into chunks
def split_text(text, max_length=512):
    sentences = text.split(". ")
    chunks = []
    current_chunk = []

    for sentence in sentences:
        if sum(len(s) for s in current_chunk) + len(sentence) + 1 <= max_length:
            current_chunk.append(sentence)
        else:
            chunks.append(". ".join(current_chunk) + ".")
            current_chunk = [sentence]

    if current_chunk:
        chunks.append(". ".join(current_chunk) + ".")

    return chunks

# AI rewrite route
@app.post("/rewrite")
async def correct_grammar(request: TextInput):
    input_text = request.text.strip()

    if not input_text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    # Split the text into manageable chunks
    chunks = split_text(input_text, max_length=512)

    corrected_chunks = []
    try:
        for chunk in chunks:
            # Correct grammar for each chunk
            results = corrector(chunk)
            corrected_text = results[0]['generated_text'].strip()
            corrected_chunks.append(corrected_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process text: {e}")

    # Combine corrected chunks back into a single string
    corrected_text = " ".join(corrected_chunks)

    return {"original_text": input_text, "corrected_text": corrected_text}

# Grammar correction route
@app.post("/correct")
async def correct_grammar(request: TextInput):
    input_text = request.text.strip()

    if not input_text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        # Check for grammar issues
        matches = tool.check(input_text)
        corrected_text = tool.correct(input_text)

        # Prepare response
        issues = [
            {
                "message": match.message,
                "offset": match.offset,
                "length": match.errorLength,
                "context": match.context,
                "suggestions": match.replacements,
            }
            for match in matches
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process text: {e}")

    return {
        "original_text": input_text,
        "corrected_text": corrected_text,
        "issues": issues,
        "issues_count": len(matches),
    }

@app.on_event("shutdown")
async def shutdown_event():
    tool.close()  # Properly shut down the server


# Health check route
@app.get("/")
async def read_root():
    return {"message": "Grammar Correction API is running!"}
