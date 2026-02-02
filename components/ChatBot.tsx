
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Bonjour ! Je suis l\'assistant IA de l\'UPG. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getChatResponse(userMsg, history);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-10 transition-colors">
          <div className="bg-upgBlue dark:bg-slate-950 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-upgGold p-1.5 rounded-full">
                <Bot size={20} className="text-upgBlue" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant virtuel UPG</h3>
                <span className="text-[10px] opacity-80 uppercase tracking-widest">IA Académique</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-upgBlue dark:bg-upgBlue text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-upgBlue/40 dark:bg-upgGold/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-upgBlue/40 dark:bg-upgGold/40 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-upgBlue/40 dark:bg-upgGold/40 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-upgBlue dark:focus:ring-upgGold text-sm outline-none dark:text-white"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-upgBlue dark:bg-upgGold text-white dark:text-upgBlue rounded-lg hover:bg-opacity-90 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-upgBlue dark:bg-upgGold hover:bg-upgBlue/90 dark:hover:bg-upgLightGold text-white dark:text-upgBlue p-4 rounded-full shadow-xl transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-semibold text-sm whitespace-nowrap">Besoin d'aide ?</span>
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
