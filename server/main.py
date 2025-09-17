from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import fitz  # <-- IMPORT PyMuPDF

# Import only the new function from your extractor
from qa_extractor import extract_flashcards_from_text

app = FastAPI()

# Your CORS middleware remains the same...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your Pydantic models remain the same...
class ChapterFlashcards(BaseModel):
    chapter: str
    questions: List[str]
    answers: List[str]

class FlashcardsResponse(BaseModel):
    chapters: List[ChapterFlashcards]
    
class TopicFlashcards(BaseModel):
    topic: str
    questions: List[str]
    answers: List[str]

class TopicsResponse(BaseModel):
    topics: List[TopicFlashcards]

# A helper function to extract text from the uploaded file
def get_text_from_uploadfile(file: UploadFile) -> str:
    try:
        # PyMuPDF needs bytes, so we read the file
        pdf_bytes = file.file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "".join(page.get_text() for page in doc)
        doc.close()
        return text
    except Exception as e:
        # If the PDF is corrupted or unreadable
        raise HTTPException(status_code=400, detail=f"Error processing PDF file: {e}")


# --- ENDPOINT 1: FOR "CHAPTERS" ---
@app.post("/extract-qa-from-pdf", response_model=FlashcardsResponse)
async def process_pdf(file: UploadFile = File(...)):
    document_text = get_text_from_uploadfile(file)
    if not document_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    # Call the new, powerful function
    concepts_dict = extract_flashcards_from_text(document_text)

    if "Error" in concepts_dict:
        raise HTTPException(status_code=500, detail=concepts_dict["Error"]["answers"][0])

    # Package the results as "ChapterFlashcards" to match the response model
    chapters_list = [
        ChapterFlashcards(chapter=concept_name, questions=data["questions"], answers=data["answers"])
        for concept_name, data in concepts_dict.items()
    ]
    return FlashcardsResponse(chapters=chapters_list)


# --- ENDPOINT 2: FOR "TOPICS" ---
@app.post("/extract-topics-from-pdf", response_model=TopicsResponse)
async def process_pdf_for_topics(file: UploadFile = File(...)):
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type.")
        
    document_text = get_text_from_uploadfile(file)
    if not document_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    # Call the SAME new, powerful function
    concepts_dict = extract_flashcards_from_text(document_text)

    if "Error" in concepts_dict:
        raise HTTPException(status_code=500, detail=concepts_dict["Error"]["answers"][0])

    # Package the results as "TopicFlashcards" to match the response model
    topics_list = [
        TopicFlashcards(topic=concept_name, questions=data["questions"], answers=data["answers"])
        for concept_name, data in concepts_dict.items()
    ]
    return TopicsResponse(topics=topics_list)

@app.get("/")
async def root():
    return {"message": "Welcome to ZapNotes"}

# Run using: uvicorn main:app --reload