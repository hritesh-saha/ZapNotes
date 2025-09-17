import os
import base64
import google.generativeai as genai
import re
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def encode_pdf_to_base64(pdf_file) -> str:
    """Encodes a PDF file to a Base64 string."""
    return base64.b64encode(pdf_file.read()).decode("utf-8")

def extract_chapter_flashcards_from_pdf(pdf_base64: str) -> Dict[str, Dict[str, List[str]]]:
    """Extracts chapter-wise question-answer pairs from a PDF using Gemini AI."""

    prompt = (
        "Extract only meaningful and practical question-answer pairs from the given PDF document. "
        "Do NOT include introductions or explanations. Only return data in plain text. "
        "Each chapter should be formatted as 'Chapter X: [Title]'. "
        "For each chapter, provide between 10 to 15 **diverse** question-answer pairs that help in understanding the topic. "
        "Avoid step-by-step algorithm breakdowns and redundant facts. "
        "Each question should start with 'Q:' and each answer should start with 'A:'. "
        "Ensure questions are diverse and concept-driven."
    )

    try:

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([prompt, {"mime_type": "application/pdf", "data": pdf_base64}])

        if not response or not hasattr(response, "text") or not response.text.strip():
            return {"Error": {"questions": [], "answers": ["Error: AI did not return a valid response."]}}

        output = response.text.strip()
        print("Raw Output from Gemini:\n", output)

        chapters = {}
        current_chapter = None
        questions, answers = [], []

        # Use regex to detect chapters dynamically
        chapter_pattern = re.compile(r"Chapter\s+\d+:\s+(.+)", re.IGNORECASE)
        question_pattern = re.compile(r"Q:\s*(.+)", re.IGNORECASE)
        answer_pattern = re.compile(r"A:\s*(.+)", re.IGNORECASE)

        for line in output.split("\n"):
            line = line.strip()

            # Detect chapters dynamically
            chapter_match = chapter_pattern.match(line)
            if chapter_match:
                if current_chapter and questions and answers:
                    chapters[current_chapter] = {
                        "questions": questions[:10], 
                        "answers": answers[:10]
                    }

                current_chapter = chapter_match.group(1).strip()
                questions, answers = [], []  # Reset for new chapter

            # Extract questions and answers
            elif question_match := question_pattern.match(line):
                questions.append(question_match.group(1).strip())

            elif answer_match := answer_pattern.match(line):
                answers.append(answer_match.group(1).strip())

        # Add the last processed chapter if valid
        if current_chapter and questions and answers:
            chapters[current_chapter] = {
                "questions": questions[:10], 
                "answers": answers[:10]
            }

        print("Extracted Chapters:\n", chapters)
        return chapters

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {"Error": {"questions": [], "answers": [f"Error: {str(e)}"]}}

def extract_topic_flashcards_from_pdf(pdf_base64: str) -> Dict[str, Dict[str, List[str]]]:
    """
    Extracts topic-wise question-answer pairs from a single-chapter PDF using Gemini AI.
    """
    # ✨ FIX 1: A much stricter prompt with an example to force the correct format.
    prompt = (
        "Your task is to identify the main distinct topics in the provided document. "
        "For each topic, provide between 10 to 15 question-answer pairs. "
        "CRITICAL: You must only return plain text and STRICTLY follow the format below. "
        "Do NOT use JSON, markdown, or any introductory sentences. "
        
        "### REQUIRED OUTPUT FORMAT ###\n"
        "Topic: [The Name of the First Topic]\n"
        "Q: [Question 1 for this topic]\n"
        "A: [Answer 1 for this topic]\n"
        "Q: [Question 2 for this topic]\n"
        "A: [Answer 2 for this topic]\n"
        "...\n"
        "Topic: [The Name of the Second Topic]\n"
        "Q: [Question 1 for this topic]\n"
        "A: [Answer 1 for this topic]\n"
        "...\n"
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash") 
        response = model.generate_content([prompt, {"mime_type": "application/pdf", "data": pdf_base64}])

        if not response or not hasattr(response, "text") or not response.text.strip():
            return {"Error": {"questions": [], "answers": ["Error: The AI did not return a valid response."]}}

        output = response.text.strip()
        print("--- Raw Output from Gemini ---\n", output)

        topics = {}
        current_topic = None
        questions, answers = [], []

        # This parsing logic is now correct because the prompt will force the right format.
        topic_pattern = re.compile(r"Topic:\s+(.+)", re.IGNORECASE)
        question_pattern = re.compile(r"Q:\s*(.+)", re.IGNORECASE)
        answer_pattern = re.compile(r"A:\s*(.+)", re.IGNORECASE)

        for line in output.split("\n"):
            line = line.strip()
            
            if topic_match := topic_pattern.match(line):
                if current_topic and questions and answers:
                    topics[current_topic] = {
                        "questions": questions,
                        "answers": answers
                    }
                current_topic = topic_match.group(1).strip()
                questions, answers = [], []
            
            elif question_match := question_pattern.match(line):
                questions.append(question_match.group(1).strip())
            
            elif answer_match := answer_pattern.match(line):
                answers.append(answer_match.group(1).strip())

        if current_topic and questions and answers:
            topics[current_topic] = {
                "questions": questions,
                "answers": answers
            }

        print("\n--- Extracted Topics ---\n", topics)
        return topics

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {"Error": {"questions": [], "answers": [f"Error: {str(e)}"]}}