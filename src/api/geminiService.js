import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded for immediate fix since Vercel Env Vars are heavily caching/failing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCiAQfdMgVGDGwHzyYh4I5yGBe0HoNskyY';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  generateChatResponse: async (history, newMessage, role) => {
    if (!API_KEY) {
      throw new Error("API Key missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
    }

    try {
      // Use the gemini-1.5-flash-8b model for fast, capable responses
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-8b",
        systemInstruction: role === 'tutor' 
          ? "You are an AI assistant designed to help tutors manage their students, plan CAS activities, grade assignments, and structure IGCSE lesson plans."
          : "You are an AI assistant designed to help IB and IGCSE students. You act as a supportive tutor, explaining complex concepts simply, helping with homework, and brainstorming CAS project ideas."
      });

      // Filter out the initial welcome message to ensure history starts cleanly
      // and ensure alternating user/model pairs if possible, but mainly Gemini requires history to start with user.
      // Easiest fix: only send previous user-model interactions, or just send a clean history.
      const validHistory = [];
      let lastRole = null;
      
      for (const msg of history) {
        const currentRole = msg.sender === 'user' ? 'user' : 'model';
        // Skip the very first message if it's from the model (the welcome message)
        if (validHistory.length === 0 && currentRole === 'model') continue;
        
        // Only add if it alternates (Gemini strictly requires user->model->user->model)
        if (currentRole !== lastRole) {
          validHistory.push({
            role: currentRole,
            parts: [{ text: msg.text }],
          });
          lastRole = currentRole;
        }
      }

      const chat = model.startChat({
        history: validHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(newMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
