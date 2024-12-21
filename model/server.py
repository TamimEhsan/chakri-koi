from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import numpy as np

# Initialize the model
model = SentenceTransformer('paraphrase-MPNet-base-v2')

# FastAPI app
app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/encode")
async def encode(input: TextInput):
    embeddings = model.encode([input.text])
    return {"embedding": embeddings[0].tolist()}