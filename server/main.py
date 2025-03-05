from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from typing import List
from qa_extractor import encode_pdf_to_base64, extract_questions_answers_from_pdf

app=FastAPI()

class QAPair(BaseModel):
    questions: List[str]
    answers: List[str]
    
@app.post("/extract-qa-from-pdf", response_model=QAPair)
async def process_pdf(file: UploadFile = File(...)):
    pdf_base64=encode_pdf_to_base64(file.file)
    questions, answers = extract_questions_answers_from_pdf(pdf_base64)
    print(questions)
    print(answers)
    return QAPair(questions=questions, answers=answers)

# Run using: uvicorn main:app --reload