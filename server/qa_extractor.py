import os
import google.generativeai as genai
import re
from dotenv import load_dotenv
from typing import Dict, List
import logging

from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception

# Set up logging so you can see retries in your terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# function that checks if the error is a rate limit
def is_rate_limit(exception):
    error_msg = str(exception).lower()
    return "429" in error_msg or "resourceexhausted" in error_msg or "quota" in error_msg

def before_retry_log(retry_state):
    if retry_state.attempt_number > 1:
        logger.warning(f"Gemini API overloaded. Retrying... Attempt #{retry_state.attempt_number}")

@retry(
    retry=retry_if_exception(is_rate_limit),
    wait=wait_exponential(multiplier=2, min=4, max=30), # Waits 4s, 8s, 16s, up to 30s
    stop=stop_after_attempt(5),                         # Gives up completely after 5 tries
    before=before_retry_log,
    reraise=True                                        # Passes the final error back down if it fails 5 times
)
def generate_with_retry(model, prompt, document_text):
    """Isolated function so Tenacity knows exactly what to retry."""
    return model.generate_content([prompt, document_text])

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
        model = genai.GenerativeModel("gemini-2.5-flash",generation_config={"temperature": 0.4,"top_p": 0.9,})
        # We send the prompt and the extracted text directly
        # response = model.generate_content([prompt, document_text])
        response = generate_with_retry(model, prompt, document_text)

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
        error_msg = str(e)
        print(f"An error occurred: {error_msg}")
        
        # --- 3. DETECT 429 AND RETURN A SPECIFIC KEY ---
        if "429" in error_msg or "ResourceExhausted" in error_msg or "quota" in error_msg.lower():
            return {"RateLimitError": {"questions": [], "answers": ["Upstream AI is overloaded. Please try again later."]}}
            
        return {"Error": {"questions": [], "answers": [f"Error: {error_msg}"]}}
