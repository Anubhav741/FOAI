import { useState, useCallback, useEffect } from 'react';
import { sendChatMessage } from '../services/chatbotService';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'iss-chat-history';

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        { id: 1, role: 'bot', text: 'Hello! I\'m your AI assistant. Ask me anything about space, AI, or news! 🚀', timestamp: new Date().toISOString() }
      ];
    } catch { return []; }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text.trim());
      const botMsg = { id: Date.now() + 1, role: 'bot', text: response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat send error:', err);
      let errText;
      if (err?.response?.status === 503) {
        errText = 'Model is loading, please try again in 30 seconds...';
      } else if (err?.response?.status === 429) {
        errText = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errText = 'Request timed out. The model may be busy — please try again.';
      } else {
        errText = err?.message || 'Failed to get response. Please try again.';
      }
      toast.error(errText);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: `⚠️ ${errText}`, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{ id: Date.now(), role: 'bot', text: 'Chat cleared! How can I help you? 🚀', timestamp: new Date().toISOString() }]);
  }, []);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  return { messages, isTyping, isOpen, sendMessage, clearChat, toggleChat };
}
