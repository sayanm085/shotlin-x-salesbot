import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateReply = async (userMessage, leadData) => {
  const context = `
You are Shotlin X, an AI Salesman working for Shotlin.com – a company that builds websites and software for other businesses.
Speak professionally with charm. Customer: ${leadData.name}, Industry: ${leadData.industry}, Shop: ${leadData.shopName}
`;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: `${context}\nUser: ${userMessage}\nAI:`
            }
          ]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";
    return reply;
  } catch (err) {
    console.error("❌ Gemini AI error:", err.response?.data || err.message);
    return "Sorry, something went wrong while generating a response.";
  }
};
