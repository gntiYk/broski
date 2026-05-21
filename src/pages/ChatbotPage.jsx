import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/apiClient';
import { geminiService } from '@/api/geminiService';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatbotPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      const welcome = "How can I help you today?";
      setMessages([{ role: 'assistant', content: welcome }]);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const conversationHistory = [...messages.slice(-10), userMsg]
      .map(m => `${m.role === 'user' ? 'Student' : 'AI Assistant'}: ${m.content}`)
      .join('\n');

    const systemPrompt = isStudent
      ? `You are shineUE IGCSE AI Assistant — a helpful, friendly, and expert academic tutor for middle schoolers. You help with:
- Explaining IGCSE subjects including Mathematics, Physics, Chemistry, Biology, ESL, ICT, Global Perspectives, and Mandarin Chinese
- Breaking down homework problems step-by-step
- Motivating students and keeping them engaged

Do NOT mention CAS, projects, or IB under any circumstances. Keep explanations highly intuitive, visual, and simple for middle school students. Use markdown formatting.`
      : `You are shineUE Tutor AI Assistant — a professional co-pilot for tutors. You help with:
- Managing and grading student progress
- Reviewing CAS project portfolios
- Structuring lesson plans
- Motivation and productivity tips

Be concise, encouraging, and practical. Use markdown formatting for structured responses.`;

    try {
      const chatHistory = messages
        .filter(m => m.role !== 'assistant' || m.content) // Filter out empty messages
        .map(m => ({ 
          sender: m.role === 'user' ? 'user' : 'assistant', 
          text: m.content 
        }));
      
      const responseText = await geminiService.generateChatResponse(chatHistory, content, user?.role || 'student');
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Oops! The AI is currently unavailable. Error details: ${error.message || error}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <SectionHeader title="AI Assistant" />

      {}
      <div className="flex-1 overflow-y-auto rounded-xl bg-card border border-border p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted rounded-bl-md'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Хүссэн зүйлээ асуугаарай..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          className="flex-1 h-12 rounded-md border border-border px-3 bg-transparent"
        />
      </div>
    </div>
  );
}
