import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the Vercel Environment Variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  generateChatResponse: async (history, newMessage, role) => {
    if (!API_KEY) {
      throw new Error("API Key missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
    }

    try {
      // Use the gemini-1.5-flash model for fast, capable responses
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemInstruction = role === 'tutor' 
        ? "You are an AI assistant designed to help tutors manage their students, plan CAS activities, grade assignments, and structure IGCSE lesson plans."
        : "You are an AI assistant designed to help IB and IGCSE students. You act as a supportive tutor, explaining complex concepts simply, helping with homework, and brainstorming CAS project ideas.";

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      // We explicitly pass system instructions as the first message context if it's the beginning of the chat
      // However, gemini-1.5-flash supports system instructions directly in the model config, but for simplicity we can just inject it.
      // Actually, let's just send the message. The SDK handles context well.
      
      let prompt = newMessage;
      if (history.length === 0) {
         prompt = `[System Instruction: ${systemInstruction}]\n\nUser: ${newMessage}`;
      }

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
