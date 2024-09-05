import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/ai', async (req, res) => {
    const userMessage = req.body.message;

    if (typeof userMessage !== 'string' || !userMessage.trim()) {
        return res.status(400).json({ error: 'Invalid message format' });
    }

    try {
        console.log(userMessage);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(userMessage);
        console.log(result)
        const response = await result.response;
        const text = response.candidates[0].content.parts[0].text;
        return res.status(200).json({ text });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content.' });
    }
});

export default router;
