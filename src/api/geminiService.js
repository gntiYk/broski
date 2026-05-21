import { GoogleGenerativeAI } from '@google/generative-ai';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  /**
   * @param {{sender: 'user' | 'assistant' | string, text: string}[]} history
   * @param {string} newMessage
   * @param {string} role
   * @returns {Promise<string>}
   */
  generateChatResponse: async (history, newMessage, role) => {
    const keyPreview = API_KEY ? `${API_KEY.substring(0, 10)}...` : '(empty)';
    
    if (!API_KEY) {
      throw new Error(`API Key is completely empty. Vercel did not inject VITE_GEMINI_API_KEY. Key preview: ${keyPreview}`);
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-8b",
        systemInstruction: role === 'tutor' 
          ? "You are an AI assistant designed to help tutors manage their students, plan CAS activities, grade assignments, and structure IGCSE lesson plans."
          : "You are an AI assistant designed to help IB and IGCSE students. You act as a supportive tutor, explaining complex concepts simply, helping with homework, and brainstorming CAS project ideas."
      });

      const validHistory = [];
      let lastRole = null;
      
      for (const msg of history) {
        const currentRole = msg.sender === 'user' ? 'user' : 'model';
        if (validHistory.length === 0 && currentRole === 'model') continue;
        
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
