import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatbotPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestions = isStudent ? [
    'Explain IGCSE Physics Newton laws',
    'Help with Math quadratic equations',
    'Give a study schedule for English ESL',
    'How does aerobic cell respiration work?',
    'Tips for IGCSE Chemistry atomic structure',
    'Review Mandarin Chinese tones'
  ] : [];

  useEffect(() => {
    if (user) {
      const welcome = isStudent 
        ? `Hi ${user.full_name?.split(' ')[0] || 'there'}! 👋 I'm your shineUE IGCSE AI Assistant. I can help you with your homework, IGCSE subject questions, study tips, or quiz reviews. How can I help you today?`
        : `Hi ${user.full_name?.split(' ')[0] || 'there'}! 👋 I'm your AI Assistant. How can I help you today?`;
      setMessages([{ role: 'assistant', content: welcome }]);
    }
  }, [user, isStudent]);

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
- Providing study guides, exam preparation tips, and time management block schedules
- Motivating students and keeping them engaged

Do NOT mention CAS, projects, or IB under any circumstances. Keep explanations highly intuitive, visual, and simple for middle school students. Use markdown formatting and LaTeX equations (e.g. $$F = m \\cdot a$$) for math/science where appropriate. Keep responses concise and under 300 words unless detail is requested.

Conversation:
${conversationHistory}

Respond as the AI Assistant:`
      : `You are a helpful, friendly, and knowledgeable AI Assistant for tutors. You help with:
- Tutoring guidance and academic advice
- Project management and organization
- Study scheduling and time management
- Motivation and productivity tips

Be concise, encouraging, and practical. Use markdown formatting for structured responses. Keep responses under 300 words unless detail is requested.

Conversation:
${conversationHistory}

Respond as the AI Assistant:`;

    const response = await api.chatbot.sendMessage({
      prompt: systemPrompt,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <SectionHeader 
        title="AI Assistant" 
        subtitle={isStudent ? "Get homework help, study tips, and quiz reviews" : "Get help with CAS planning, study tips, and more"} 
      />

      {/* Chat Messages */}
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
                  <Sparkles className="w-4 h-4 text-white" />
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
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

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex gap-2 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder={isStudent ? "Ask me anything about your IGCSE subjects, homework..." : "Ask me anything about CAS, studying, or planning..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
