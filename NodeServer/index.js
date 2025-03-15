import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const api_key=process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(api_key);

const convertPDFToBase64 = (pdfBuffer) => {
    try {
        return pdfBuffer.toString("base64");
    } catch (error) {
        console.error("Error converting PDF to Base64:", error);
        return null;
    }
};

app.post("/extract-qa-from-pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    try {
        const base64PDF = convertPDFToBase64(req.file.buffer);
        console.log("Base64 PDF Output:", base64PDF.substring(0, 100))
        if (!base64PDF) throw new Error("Failed to convert PDF to Base64.");

        // ✅ Send Base64 PDF to Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Extract only meaningful and practical question-answer pairs from the given PDF document.
            Do NOT include introductions or explanations. Only return data in plain text.
            Format chapters as 'Chapter X: [Title]'.
            For each chapter, provide exactly 10 diverse question-answer pairs that help in understanding the topic.
            Each question should start with 'Q:' and each answer should start with 'A:'.
            Ensure questions are diverse and concept-driven.
        `;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "application/pdf", data: base64PDF } }
                    ]
                }
            ]
        });

        const aiResponse = result.response.text();
        console.log(aiResponse);
        if (!aiResponse) throw new Error("AI did not return a valid response.");

        const structuredFlashcards = processAIResponse(aiResponse);

        res.json({ chapters: structuredFlashcards });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const processAIResponse = (aiText) => {
    const chapters = [];
    let currentChapter = null;
    let questions = [];
    let answers = [];

    const chapterPattern = /^Chapter\s+\d+:\s+(.+)/i;
    const questionPattern = /^Q:\s*(.+)/i;
    const answerPattern = /^A:\s*(.+)/i;

    aiText.split("\n").forEach((line) => {
        line = line.trim();

        const chapterMatch = line.match(chapterPattern);
        if (chapterMatch) {
            if (currentChapter && questions.length > 0 && answers.length > 0) {
                chapters.push({ chapter: currentChapter, questions, answers });
            }
            currentChapter = chapterMatch[1].trim();
            questions = [];
            answers = [];
        }

        const questionMatch = line.match(questionPattern);
        if (questionMatch) {
            questions.push(questionMatch[1].trim());
        }


        const answerMatch = line.match(answerPattern);
        if (answerMatch) {
            answers.push(answerMatch[1].trim());
        }
    });

 
    if (currentChapter && questions.length > 0 && answers.length > 0) {
        chapters.push({ chapter: currentChapter, questions, answers });
    }

    return chapters;
};

app.listen(port, () => console.log(`Server running`));
