import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minus,
  Bot,
} from 'lucide-react';
import api from '../services/api';

const QUICK_SUGGESTIONS = [
  'How do I add an expense?',
  'How does budget forecasting work?',
  'Money saving tips for students',
  'What categories are available?',
];

function formatText(text) {
  return text.split('\n').map((line, i) => {
    const boldLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const italicLine = boldLine.replace(/\*(.+?)\*/g, '<em>$1</em>');
    const codeLine = italicLine.replace(
      /`(.+?)`/g,
      '<code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;font-family:monospace;font-size:0.85em">$1</code>'
    );

    const isBullet = /^[•\-]\s/.test(line);
    const isNumbered = /^\d+\.\s/.test(line);

    if (isBullet) {
      const content = line.replace(/^[•\-]\s/, '');
      const formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
      return (
        <div key={i} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
          <span style={{ color: '#60a5fa', fontWeight: 700, minWidth: 12, flexShrink: 0 }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    }

    if (isNumbered) {
      const num = line.match(/^(\d+)\./)?.[1];
      const content = line.replace(/^\d+\.\s/, '');
      const formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
      return (
        <div key={i} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
          <span style={{ color: '#60a5fa', fontWeight: 700, minWidth: 16, flexShrink: 0 }}>{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    }

    return line ? (
      <p key={i} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: codeLine }} />
    ) : (
      <div key={i} style={{ height: 6 }} />
    );
  });
}

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '80%' }}>
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
      <Bot size={14} className="text-white" />
    </div>
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 16 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-gray-400"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatMessage = ({ msg }) => {
  const isBot = msg.sender === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexDirection: isBot ? 'row' : 'row-reverse' }}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isBot
            ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-sm'
        }`}
        style={{ maxWidth: '80%', lineHeight: 1.55 }}
      >
        <div>{formatText(msg.text)}</div>
        <p
          style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}
          className={isBot ? 'text-gray-400 dark:text-gray-500' : 'text-blue-100'}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "Hi! 👋 I'm **Spidy**, your AI financial assistant.\n\nI can help you with:\n• Using Expense Tracker features\n• Student budgeting tips & tricks\n• Understanding your finances\n\nWhat can I help you with today?",
  timestamp: new Date().toISOString(),
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (overrideText) => {
    const content = (overrideText || inputValue).trim();
    if (!content || isTyping) return;
    setInputValue('');

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = [...messages, userMsg].slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await api.post('/ai/chat', { message: content, messages: history }, { timeout: 12000 });

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: res.data.reply || "Sorry, I had trouble processing that. Please try again!",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: "Oops! Something went wrong. Please try again in a moment! 😅",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}`, timestamp: new Date().toISOString() }]);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            style={{ height: 520 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles size={18} className="text-yellow-200" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">Spidy</p>
                  <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    AI Financial Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={clearChat} title="Clear chat" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollBehavior: 'smooth' }}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0"
                >
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 hover:bg-blue-100 dark:hover:bg-blue-800/60 transition-colors font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  id="chatbot-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Spidy anything..."
                  rows={1}
                  className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  style={{ maxHeight: 88, lineHeight: 1.4 }}
                />
                <button
                  id="chatbot-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-center mt-1.5" style={{ fontSize: 10, color: '#9ca3af' }}>
                Powered by Spidy · Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close-icon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="open-icon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {hasUnread && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"
          />
        )}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
