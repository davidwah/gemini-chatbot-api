import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';

dotenv.config();

// Periksa keberadaan API Key saat aplikasi dimulai
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY tidak terdefinisi. Silakan buat file .env dan tambahkan API key Anda.");
  process.exit(1); // Hentikan aplikasi jika key tidak ada
}

const app = express();
const port = process.env.PORT || 3000;

// midleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash'});


// Route penting!
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Message is required." });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error("Error saat memanggil Gemini API:", err);
        // Berikan pesan error yang lebih spesifik
        if (err instanceof GoogleGenerativeAIFetchError) {
            return res.status(err.status || 500).json({ reply: `API Error: ${err.message}` });
        }
        // Error umum untuk masalah lainnya
        res.status(500).json({ reply: "Terjadi kesalahan tak terduga di server." });
    }
});


app.listen(port, () => {
  console.log(`Gemini Chatbot running on http://localhost:${port}`);
});