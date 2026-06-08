import os
from dotenv import load_dotenv
load_dotenv()

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from sentence_transformers import SentenceTransformer, util
import chromadb

from database import db
from .slm import model

# ============================================================
# MODELS AND CLIENTS
# ============================================================

embedder = SentenceTransformer("BAAI/bge-small-en-v1.5")
chroma_client = chromadb.Client()
out = StrOutputParser()

# ============================================================
# BLOCK 1 — ANSWER KEY PROCESSING
# ============================================================

def chunk_text(text, chunk_size=150, chunk_overlap=20):
    """
    Split long faculty answer into overlapping chunks
    Smaller chunks = one concept per chunk = better retrieval
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_text(text)
    print(f"  [RAG] Chunked into {len(chunks)} pieces")
    return chunks


def summarise_chunk(chunk):
    """
    Use SLM to summarise each chunk into a concise academic statement
    """
    system_instruction = """
You are an academic summariser.
Given a passage from a faculty answer, write a single concise sentence
that captures the key academic concept in the passage.
Output only the summary sentence. No explanation. No markdown.
"""
    prompt = ChatPromptTemplate.from_messages([
        {"role": "system", "content": system_instruction},
        {"role": "user",   "content": chunk}
    ])
    chain = prompt | model | out
    summary = chain.invoke({})
    return summary.strip()


def generate_embeddings(texts):
    """
    Generate normalised embeddings for a list of texts
    """
    embeddings = embedder.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False
    )
    return embeddings.tolist()


def process_answer_key(question_id):
    """
    RAG Block 1:
    Fetch answer key → chunk → summarise → embed → store in ChromaDB
    Called once when faculty submits the answer key
    """
    print(f"\n[RAG Block 1] Processing answer key for question {question_id}")

    answer_key_doc = db.AnswerKey.find_one({"question_id": question_id})
    if not answer_key_doc or not answer_key_doc.get("key_text"):
        print("  [RAG Block 1] No answer key found")
        return None

    faculty_answer = answer_key_doc["key_text"]
    print(f"  [RAG Block 1] Answer key length: {len(faculty_answer.split())} words")

    if len(faculty_answer.split()) < 100:
        print("  [RAG Block 1] Short answer — skipping chunking")
        chunks    = [faculty_answer]
        summaries = [faculty_answer]
    else:
        chunks = chunk_text(faculty_answer)

        print("  [RAG Block 1] Summarising chunks...")
        summaries = []
        for i, chunk in enumerate(chunks):
            summary = summarise_chunk(chunk)
            summaries.append(summary)
            print(f"    chunk {i+1}: {summary[:80]}...")

    print("  [RAG Block 1] Generating embeddings...")
    embeddings = generate_embeddings(summaries)

    collection_name = f"q_{question_id}"
    try:
        chroma_client.delete_collection(name=collection_name)
    except Exception:
        pass

    collection = chroma_client.create_collection(name=collection_name)
    collection.add(
        documents=summaries,
        embeddings=embeddings,
        metadatas=[{"original_chunk": chunks[i]} for i in range(len(chunks))],
        ids=[f"chunk_{i}" for i in range(len(chunks))]
    )
    print(f"  [RAG Block 1] Stored {len(summaries)} embeddings in ChromaDB")

    db.AnswerKey.update_one(
        {"question_id": question_id},
        {"$set": {
            "chunk_summaries": summaries,
            "original_chunks": chunks
        }}
    )

    print(f"  [RAG Block 1] Done for question {question_id}")
    return collection_name


# ============================================================
# BLOCK 2 — RETRIEVAL HELPERS
# ============================================================

def get_relevant_faculty_chunk(question_id, rubric_point_text, top_k=1):
    """
    For a given rubric point find the most relevant
    faculty answer chunk from ChromaDB
    """
    collection_name = f"q_{question_id}"

    try:
        collection = chroma_client.get_collection(name=collection_name)
    except Exception:
        print("  Collection not found — running Block 1 first")
        process_answer_key(question_id)
        collection = chroma_client.get_collection(name=collection_name)

    query_embedding = embedder.encode(
        [rubric_point_text],
        normalize_embeddings=True
    ).tolist()[0]

    actual_top_k = min(top_k, collection.count())
    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=actual_top_k,
        include=["documents", "metadatas", "distances"]
    )

    best_chunk = result["documents"][0][0]
    return best_chunk


def get_relevant_student_sentence(student_answer, rubric_point_text):
    """
    From the student answer find the single most relevant
    sentence for a given rubric point
    """
    sentences = [
        s.strip()
        for s in student_answer.replace("\n", " ").split(".")
        if s.strip()
    ]

    if not sentences:
        return student_answer

    if len(sentences) == 1:
        return sentences[0]

    all_texts  = sentences + [rubric_point_text]
    embeddings = embedder.encode(all_texts, normalize_embeddings=True)

    sentence_embeddings = embeddings[:-1]
    rubric_embedding    = embeddings[-1]

    scores   = util.cos_sim(rubric_embedding, sentence_embeddings)[0]
    best_idx = int(scores.argmax())

    return sentences[best_idx]


# ============================================================
# BLOCK 2 — MAIN RETRIEVAL
# ============================================================

def build_focused_context(question_id, student_answer, rubric_points):
    """
    RAG Block 2:
    For each rubric point retrieve:
    - most relevant faculty chunk
    - most relevant student sentence
    Returns focused context list ready to pass to SLM
    """
    print(f"\n[RAG Block 2] Building focused context for question {question_id}")

    focused_contexts = []

    for point in rubric_points:
        rubric_id   = point.get("rubrics_id", "")
        rubric_text = point.get("content", "")

        faculty_chunk = get_relevant_faculty_chunk(
            question_id,
            rubric_text,
            top_k=1
        )

        student_sentence = get_relevant_student_sentence(
            student_answer,
            rubric_text
        )

        focused_contexts.append({
            "rubric_id":        rubric_id,
            "rubric_text":      rubric_text,
            "faculty_chunk":    faculty_chunk,
            "student_evidence": student_sentence
        })

        print(f"  {rubric_id}: {rubric_text}")
        print(f"    faculty:  {faculty_chunk[:80]}...")
        print(f"    student:  {student_sentence[:80]}...")

    return focused_contexts


# ============================================================
# MAIN ENTRY POINT — called from pipeline.py
# ============================================================

def get_focused_context_for_slm(question_id, student_id, student_answer):
    """
    Main function called from pipeline.py
    Returns focused context per rubric point for SLM to evaluate
    """
    rubric_doc    = db.Rubric.find_one({"question_id": question_id})
    rubric_points = rubric_doc.get("verified_points_json", []) if rubric_doc else []

    if not rubric_points:
        print("  [RAG] No rubric points found")
        return []

    focused_contexts = build_focused_context(
        question_id,
        student_answer,
        rubric_points
    )

    # save to MongoDB for audit
    db.EvaluationResult.update_one(
        {"question_id": question_id, "student_id": student_id},
        {"$set": {"rag_focused_contexts": focused_contexts}},
        upsert=True
    )

    return focused_contexts