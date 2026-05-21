import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/apiClient';
import { geminiService, getMockAIResponse } from '@/api/geminiService';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { User, Loader2, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function ChatbotPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const chatEndRef = useRef(null);

  const REVOKED_KEY = "AIzaSyCiAQfdMgVGDGwHzyYh4I5yGBe0HoNskyY";

  useEffect(() => {
    const key = localStorage.getItem('VITE_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
    const isValid = key && key !== REVOKED_KEY && !key.includes('YOUR_GEMINI_API_KEY') && key !== 'undefined';
    setIsLive(!!isValid);
    setApiKey(isValid ? key : '');
  }, []);

  const handleSaveApiKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('VITE_GEMINI_API_KEY', trimmed);
      setIsLive(true);
      setShowConfig(false);
      toast.success("API key activated! Chat is now live.");
    } else {
      localStorage.removeItem('VITE_GEMINI_API_KEY');
      setIsLive(false);
      toast.error("API key cleared. Switched to demo mode.");
    }
  };

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
      toast.error("Gemini API request failed. Falling back to Demo Mode.");
      setIsLive(false);
      setShowConfig(true);
      
      const fallbackText = getMockAIResponse(content, user?.role || 'student');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: fallbackText 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <SectionHeader title="AI Assistant" />

      {/* API Key Status Banner */}
      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-all duration-300 ${
        isLive 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
      }`}>
        <div className="flex items-center gap-2">
          {isLive ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
          )}
          <span>
            {isLive 
              ? '🟢 Live Mode: Connected to Gemini API' 
              : '✨ Demo Mode: Using local academic mock responses. (Key not set or revoked)'}
          </span>
        </div>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="underline font-medium hover:opacity-85 flex items-center gap-1 cursor-pointer"
        >
          <Key className="w-3 h-3" />
          {showConfig ? 'Hide Config' : 'Configure API Key'}
        </button>
      </div>

      {/* Inline Configuration Card */}
      {showConfig && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden bg-card border border-border rounded-lg p-4 space-y-3"
        >
          <div className="flex flex-col gap-1">
            <h4 className="font-heading font-semibold text-sm flex items-center gap-1.5 text-foreground">
              Configure Gemini API Key
            </h4>
            <p className="text-xs text-muted-foreground">
              Get a free API key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline font-medium"
              >
                Google AI Studio
              </a>
              . Your key is stored locally in your browser.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your Gemini API key (AIzaSy...)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button
              onClick={handleSaveApiKey}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </motion.div>
      )}

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

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={isLive ? "Хүссэн зүйлээ асуугаарай..." : "Асуултаа бичнэ үү (жишээ нь: math, physics, cas...)"}
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
