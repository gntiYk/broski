// Generic API Client Wrapper
// Replace these with actual fetch/axios calls to your new backend (Firebase, Supabase, Node, etc.)

export const api = {
  auth: {
    loginViaEmailPassword: async (email, password, role = 'student') => {
      console.log('Mock login:', email, 'Role:', role);
      const user = { id: Math.random().toString(), email, role };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { user };
    },
    register: async (email, password, name, role) => {
      console.log('Mock register:', email, role);
      const user = { id: Math.random().toString(), email, full_name: name, role };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { user };
    },
    me: async () => {
      const stored = localStorage.getItem('mock_user');
      if (stored) return JSON.parse(stored);
      return null;
    },
    logout: async () => {
      console.log('Mock logout');
      localStorage.removeItem('mock_user');
    },
    resetPasswordRequest: async (email) => {
      console.log('Mock reset password:', email);
    },
    loginWithProvider: (provider, redirectUrl) => {
      console.log('Mock login with provider:', provider);
      const user = { id: '1', email: 'google@example.com', role: 'student' };
      localStorage.setItem('mock_user', JSON.stringify(user));
      window.location.href = redirectUrl || '/student';
    },
    redirectToLogin: (redirectUrl) => {
      window.location.href = '/login';
    }
  },
  entities: {
    Project: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    },
    Booking: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    },
    CalendarEvent: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    },
    Message: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    },
    Notification: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    },
    User: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => ({ id: Math.random(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ id })
    }
  },
  chatbot: {
    sendMessage: async ({ prompt }) => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          return "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
        }
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          return data.candidates[0].content.parts[0].text;
        }
        return data.error?.message || "Sorry, I couldn't generate a response. Please try again.";
      } catch (error) {
        console.error("Gemini API error:", error);
        return "Failed to connect to the AI Assistant. Please check your network and try again.";
      }
    }
  }
};
