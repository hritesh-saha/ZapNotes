import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List,Tuple

load_dotenv()

GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

def encode_pdf_to_base64(pdf_file) -> str:
    return base64.b64encode(pdf_file.read()).decode("utf-8")

def extract_questions_answers_from_pdf(pdf_base64: str) -> Tuple[ List[str], List[str]]:
    
    prompt = (
    "Extract all important question-answer pairs from the given PDF document. "
    "Ensure that each question starts with 'Q:' and each answer starts with 'A:'. "
    "Maintain the correct sequence of questions followed by their corresponding answers."
)
    
    try:
        model=genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([prompt, {"mime_type": "application/pdf", "data": pdf_base64}])
        
        output=response.text
        
        questions, answers=[], []
        pairs=output.split("\n")
        
        for line in pairs:
            if line.startswith("Q:"):
                questions.append(line[2:].strip())
            elif line.startswith("A:"):
                answers.append(line[2:].strip())
                
        return questions, answers
    except Exception as e:
        return [], [f"Error: {str(e)}"]