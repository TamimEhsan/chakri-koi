import os
from sentence_transformers import SentenceTransformer, util

# Paths to input folders
resume_folder = "input/resume/"
job_folder = "input/jobs/"

# Load SBERT model
model = SentenceTransformer('paraphrase-MPNet-base-v2')  # Change the model if needed

# Function to read text files from a folder
def read_text_files(folder_path):
    texts = {}
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if os.path.isfile(file_path) and file_name.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8') as f:
                texts[file_name] = f.read()
    return texts

# Read resumes and job posts
resumes = read_text_files(resume_folder)
job_posts = read_text_files(job_folder)

# Compute embeddings for resumes and job posts
resume_embeddings = {name: model.encode(content, convert_to_tensor=True) for name, content in resumes.items()}
job_embeddings = {name: model.encode(content, convert_to_tensor=True) for name, content in job_posts.items()}

# Compute similarity scores
results = []
for resume_name, resume_embedding in resume_embeddings.items():
    for job_name, job_embedding in job_embeddings.items():
        similarity_score = util.cos_sim(resume_embedding, job_embedding).item()
        results.append((resume_name, job_name, similarity_score))

# Sort results by similarity score
results = sorted(results, key=lambda x: x[2], reverse=True)

# Display the top matches
print("Top Resume-Job Matches:")
for resume_name, job_name, score in results[:10]:  # Show top 10 matches
    print(f"Resume: {resume_name} <-> Job Post: {job_name} | Similarity: {score:.4f}")
