from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from qa_extractor import encode_pdf_to_base64, extract_chapter_flashcards_from_pdf, extract_topic_flashcards_from_pdf

app = FastAPI()

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ChapterFlashcards(BaseModel):
    chapter: str
    questions: List[str]
    answers: List[str]

class FlashcardsResponse(BaseModel):
    chapters: List[ChapterFlashcards]
    
class TopicFlashcards(BaseModel):
    """Represents the flashcards for a single topic."""
    topic: str
    questions: List[str]
    answers: List[str]

class TopicsResponse(BaseModel):
    """The final response structure containing a list of all topics."""
    topics: List[TopicFlashcards]

@app.post("/extract-qa-from-pdf", response_model=FlashcardsResponse)
async def process_pdf(file: UploadFile = File(...)):
    pdf_base64 = encode_pdf_to_base64(file.file)
    chapters_dict = extract_chapter_flashcards_from_pdf(pdf_base64)

    if "Error" in chapters_dict:
        raise HTTPException(status_code=400, detail=chapters_dict["Error"]["answers"][0])

    # Convert dictionary to list of ChapterFlashcards objects
    chapters_list = [
        ChapterFlashcards(chapter=chapter, questions=data["questions"], answers=data["answers"])
        for chapter, data in chapters_dict.items()
    ]

    return FlashcardsResponse(chapters=chapters_list)

@app.post("/extract-topics-from-pdf", response_model=TopicsResponse)
async def process_pdf_for_topics(file: UploadFile = File(...)):
    """
    Accepts a PDF file and returns topic-based question-answer pairs.
    """
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")
        
    pdf_base64 = encode_pdf_to_base64(file.file)
    
    topics_dict = extract_topic_flashcards_from_pdf(pdf_base64)

    # Handle potential errors from the AI model
    if "Error" in topics_dict:
        error_detail = topics_dict["Error"]["answers"][0]
        raise HTTPException(status_code=500, detail=error_detail)

    # Convert the dictionary of topics into a list of TopicFlashcards objects
    topics_list = [
        TopicFlashcards(topic=topic_name, questions=data["questions"], answers=data["answers"])
        for topic_name, data in topics_dict.items()
    ]

    return TopicsResponse(topics=topics_list)

@app.get("/")
async def root():
    return {"message": "Welcome to ZapNotes"}


# Run using: uvicorn main:app --reload
