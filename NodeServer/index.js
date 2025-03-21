import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Enable CORS for frontend requests
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ✅ Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.get("/", (req, res) => {
    res.send("Hello from ZapNotes!");
});

// ✅ Convert PDF Buffer to Base64
const convertPDFToBase64 = (pdfBuffer) => {
    try {
        return pdfBuffer.toString("base64");
    } catch (error) {
        console.error("Error converting PDF to Base64:", error);
        return null;
    }
};

// ✅ Extract QA Pairs from PDF
const extractQAFromPDF = async (base64PDF) => {
    const prompt = `
        Extract only meaningful and practical question-answer pairs from the given PDF document.
        Do NOT include introductions or explanations. Only return data in plain text.
        Format chapters as 'Chapter X: [Title]'.
        For each chapter, provide exactly 10 diverse question-answer pairs that help in understanding the topic.
        Each question should start with 'Q:' and each answer should start with 'A:'.
        Ensure questions are diverse and concept-driven.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
        console.log("AI Raw Output:", aiResponse.substring(0, 500));

        if (!aiResponse) throw new Error("AI did not return a valid response.");

        return processAIResponse(aiResponse);
    } catch (error) {
        console.error("Error extracting QA from PDF:", error);
        throw error;
    }
};

// ✅ Process AI Response into structured format
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

// ✅ Endpoint: Extract QA from PDF
app.post("/extract-qa-from-pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    try {
        const base64PDF = convertPDFToBase64(req.file.buffer);
        if (!base64PDF) throw new Error("Failed to convert PDF to Base64.");

        const structuredFlashcards = await extractQAFromPDF(base64PDF);

        res.json({ chapters: structuredFlashcards });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
