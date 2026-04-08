import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Mic, 
  X, 
  ShieldCheck,
  RefreshCw,
  Loader2,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { analyzeComplaint } from '../utils/detectDepartment';
import AIAnalysisCard from './AIAnalysisCard';
import { aiChat } from '../api/janvoiceApi';

const AIAssistant = ({ language, onApplyRefinement, initialDescription = "" }) => {
  const [input, setInput] = useState(initialDescription);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      text: language === 'Kannada' 
        ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ JanVoice AI ಸಹಾಯಕ. ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ, ಮತ್ತು ನಾನು ಅದನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತೇನೆ."
        : "Hello! I'm your JanVoice AI assistant. Describe your issue here, and I'll analyze it in real-time." 
    }
  ]);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef(null);

  const t = {
    English: {
      title: "JanVoice AI Assistant",
      online: "Always Online",
      placeholder: "Type your complaint here...",
      refine: "Refine & Apply",
      verified: "Verified Reporting",
      verifiedDesc: "Your grievance is digitally signed and tracked. We guarantee a response within 48 business hours.",
      analyzing: "AI is analyzing...",
      welcome: "How can I help you today?"
    },
    Kannada: {
      title: "JanVoice AI ಸಹಾಯಕ",
      online: "ಯಾವಾಗಲೂ ಆನ್‌ಲೈನ್",
      placeholder: "ನಿಮ್ಮ ದೂರನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
      refine: "ಪರಿಷ್ಕರಿಸಿ ಮತ್ತು ಅನ್ವಯಿಸಿ",
      verified: "ಪರಿಶೀಲಿಸಿದ ವರದಿ",
      verifiedDesc: "ನಿಮ್ಮ ದೂರನ್ನು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಸಹಿ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ. ನಾವು 48 ವ್ಯವಹಾರ ಗಂಟೆಗಳ ಒಳಗೆ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಖಾತರಿಪಡಿಸುತ್ತೇವೆ.",
      analyzing: "AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      welcome: "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
    }
  };

  const labels = t[language || 'English'];

  // Debounced Analysis
  useEffect(() => {
    if (!input || input.trim().length < 10) {
      setAnalysis(null);
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const result = analyzeComplaint(input);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, analysis, isAnalyzing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newUserMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, newUserMsg]);

    setIsTyping(true);
    try {
      const payload = [
        ...messages.map(m => ({ role: m.role === 'ai' ? 'ai' : 'user', content: m.text })),
        { role: 'user', content: input }
      ];
      const res = await aiChat(payload, language || 'English');
      const reply = res?.reply || (language === 'Kannada' ? 'ಕ್ಷಮಿಸಿ, ಉತ್ತರ ಸಿಗಲಿಲ್ಲ.' : 'Sorry, no response.');
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: e?.message || 'AI request failed.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="glass flex-1 flex flex-col rounded-[3rem] overflow-hidden border-indigo-100 dark:border-indigo-900/30 shadow-2xl shadow-indigo-500/5">
        {/* AI Header */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Bot size={24} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" 
              />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white leading-tight">{labels.title}</h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">{labels.online}</p>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                msg.role === 'ai' 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50' 
                : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Live Analysis Card */}
          {analysis && (
            <AIAnalysisCard 
              analysis={analysis} 
              isAnalyzing={isAnalyzing} 
              language={language} 
            />
          )}

          {isAnalyzing && !analysis && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none flex gap-1 items-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={labels.placeholder}
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all dark:text-white text-sm font-medium resize-none pr-14"
            />
            <div className="absolute right-3 bottom-3 flex flex-col gap-2">
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
          {analysis && analysis.detected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onApplyRefinement(analysis)}
              className="w-full mt-4 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 group"
            >
              <Sparkles size={16} className="text-indigo-400 group-hover:animate-pulse" />
              {labels.refine}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Verified Badge */}
      <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-[3rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700">
          <ShieldCheck size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={20} className="text-indigo-200" />
            <h4 className="text-lg font-black tracking-tight">{labels.verified}</h4>
          </div>
          <p className="text-xs text-indigo-100 leading-relaxed font-medium">
            {labels.verifiedDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
