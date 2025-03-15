import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Configure Multer (for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 🔄 Convert PDF to Base64
 */
const convertPDFToBase64 = (pdfBuffer) => {
    try {
        return pdfBuffer.toString("base64"); // Convert buffer to Base64
    } catch (error) {
        console.error("Error converting PDF to Base64:", error);
        return null;
    }
};

/**
 * 📌 POST API - Upload PDF, Convert to Base64 & Extract Q&A
 */
app.post("/extract-qa-from-pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    try {
        // Convert PDF to Base64
        const base64PDF = convertPDFToBase64(req.file.buffer);
        if (!base64PDF) throw new Error("Failed to convert PDF to Base64.");

        // ✅ Send Base64 PDF to Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Extract only meaningful and practical question-answer pairs from the given PDF document.
            Do NOT include introductions or explanations.
            Format chapters as 'Chapter X: [Title]'.
            For each chapter, provide exactly 10 **diverse** question-answer pairs that help in understanding the topic.
            Each question should start with 'Q:' and each answer should start with 'A:'.
            Ensure questions are diverse and concept-driven.
        `;

        const result = await model.generateContent([
            prompt,
            { mime_type: "application/pdf", data: base64PDF }
        ]);

        // ✅ Extract response from Gemini
        const aiResponse = result.response.text();

        if (!aiResponse) {
            throw new Error("AI did not return a valid response.");
        }

        res.json({ flashcards: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
