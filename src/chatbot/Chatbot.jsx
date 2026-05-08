import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Trash2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>
        <Bot size={14} className="text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center"
        style={{ background: 'var(--color-surface-2)' }}>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isBot ? 'rounded-bl-sm' : 'rounded-br-sm'
        }`}
        style={isBot
          ? { background: 'var(--color-surface-2)', color: 'var(--color-text)' }
          : { background: 'var(--color-primary)', color: '#fff' }
        }
      >
        {isBot ? (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              code: ({ children }) => (
                <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {children}
                </code>
              ),
            }}
          >
            {msg.text}
          </ReactMarkdown>
        ) : (
          msg.text
        )}
      </div>
    </motion.div>
  );
}

export default function Chatbot() {
  const { messages, isTyping, isOpen, sendMessage, clearChat, toggleChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', boxShadow: '0 0 24px rgba(99,102,241,0.5)' }}
        title="AI Assistant"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={22} className="text-white" /> : <Bot size={22} className="text-white" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] rounded-2xl flex flex-col chat-window overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
              style={{ borderColor: 'var(--color-border)', background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(34,211,238,0.1))' }}>
              <div className="flex items-center gap-2">
                <Bot size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>AI Assistant</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>DeepSeek-V4-Pro · Space & AI Expert</p>
                </div>
              </div>
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-muted)' }} title="Clear chat">
                <Trash2 size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about space, AI, news..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none border transition-colors"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    fontFamily: 'Inter, sans-serif',
                    maxHeight: '80px',
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                Press Enter to send · Shift+Enter for newline
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
