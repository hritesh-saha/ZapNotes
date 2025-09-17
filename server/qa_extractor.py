import os
import google.generativeai as genai
import re
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def extract_flashcards_from_text(document_text: str, mode: str = "topic") -> Dict[str, Dict[str, List[str]]]:
    """
    Extracts flashcards from plain text, which is much faster.
    'mode' can be 'topic' or 'chapter' to slightly change the prompt.
    """
    
    if mode == "chapter":
        structure_prompt = "Identify the chapters in the provided text."
        item_name = "Chapter"
    else: # Default to 'topic'
        structure_prompt = "Break this text down into its key concepts or topics."
        item_name = "Topic"

    prompt = (
        f"{structure_prompt} "
        "For each one, provide the 5 to 8 most important question-answer pairs. "
        "CRITICAL: You must only return plain text and STRICTLY follow the format below. "
        "Do NOT use JSON, markdown, or any introductory sentences.\n\n"
        "### REQUIRED OUTPUT FORMAT ###\n"
        f"{item_name}: [Name of the First {item_name}]\n"
        "Q: [Question 1]\n"
        "A: [Answer 1]\n"
        "Q: [Question 2]\n"
        "A: [Answer 2]\n"
        "...\n"
        f"{item_name}: [Name of the Second {item_name}]\n"
        "Q: [Question 1]\n"
        "A: [Answer 1]\n"
        "..."
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        # We send the prompt and the extracted text directly
        response = model.generate_content([prompt, document_text])

        if not response or not hasattr(response, "text") or not response.text.strip():
            return {"Error": {"questions": [], "answers": ["Error: The AI did not return a valid response."]}}

        output = response.text.strip()
        print("--- Raw Output from Gemini ---\n", output)

        results = {}
        current_item_name = None
        questions, answers = [], []

        # Regex to find either "Topic:" or "Chapter:"
        item_pattern = re.compile(rf"{item_name}:\s+(.+)", re.IGNORECASE)
        question_pattern = re.compile(r"Q:\s*(.+)", re.IGNORECASE)
        answer_pattern = re.compile(r"A:\s*(.+)", re.IGNORECASE)

        for line in output.split("\n"):
            line = line.strip()
            
            if item_match := item_pattern.match(line):
                if current_item_name and questions and answers:
                    results[current_item_name] = {"questions": questions, "answers": answers}
                current_item_name = item_match.group(1).strip()
                questions, answers = [], []
            
            elif question_match := question_pattern.match(line):
                questions.append(question_match.group(1).strip())
            
            elif answer_match := answer_pattern.match(line):
                answers.append(answer_match.group(1).strip())

        if current_item_name and questions and answers:
            results[current_item_name] = {"questions": questions, "answers": answers}

        print(f"\n--- Extracted {item_name}s ---\n", results)
        return results

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {"Error": {"questions": [], "answers": [f"Error: {str(e)}"]}}
