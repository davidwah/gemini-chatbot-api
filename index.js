import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// midleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'});

app.listen(port, () => {
  console.log(`Gemini Chatbot running on http://localhost:${port}`);
});