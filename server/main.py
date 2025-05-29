from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from qa_extractor import encode_pdf_to_base64, extract_chapter_flashcards_from_pdf

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

@app.get("/")
async def root():
    return {"message": "Welcome to ZapNotes"}


# Run using: uvicorn main:app --reload
