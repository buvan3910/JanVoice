import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Tag, 
  FileText,
  Loader2
} from 'lucide-react';

const AiSuggestionBox = ({ detection, isTyping, language, descriptionLength = 0 }) => {
  const t = {
    English: {
      aiDetected: "AI Detected:",
      suggestedDept: "Suggested Department:",
      confidence: "Confidence:",
      issueTags: "Issue Tags:",
      summary: "AI Summary:",
      noDetection: "AI could not confidently detect the department. Please select manually.",
      analyzing: "AI is analyzing your complaint...",
      lowConfidence: "AI Detection is low. Please verify."
    },
    Kannada: {
      aiDetected: "AI ಪತ್ತೆಹಚ್ಚಿದೆ:",
      suggestedDept: "ಸೂಚಿಸಲಾದ ಇಲಾಖೆ:",
      confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ:",
      issueTags: "ಸಮಸ್ಯೆಯ ಟ್ಯಾಗ್‌ಗಳು:",
      summary: "AI ಸಾರಾಂಶ:",
      noDetection: "AI ಇಲಾಖೆಯನ್ನು ವಿಶ್ವಾಸದಿಂದ ಪತ್ತೆಹಚ್ಚಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹಸ್ತಚಾಲಿತವಾಗಿ ಆಯ್ಕೆಮಾಡಿ.",
      analyzing: "AI ನಿಮ್ಮ ದೂರನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      lowConfidence: "AI ಪತ್ತೆಹಚ್ಚುವಿಕೆ ಕಡಿಮೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ."
    }
  };

  const labels = t[language || 'English'];

  if (descriptionLength < 10 && !isTyping) {
    return null;
  }

  if (!detection.detected && !isTyping) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl border border-gray-200/50 bg-white/30 backdrop-blur-md dark:bg-gray-800/30 dark:border-gray-700/50 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 italic"
      >
        <AlertCircle className="w-4 h-4 text-amber-500" />
        {labels.noDetection}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={detection.department || 'analyzing'}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className={`mt-4 overflow-hidden rounded-2xl border transition-all duration-300 glass ${
          isTyping 
            ? 'border-blue-200/50 bg-blue-50/30 dark:border-blue-800/30 dark:bg-blue-900/10' 
            : 'border-indigo-200/50 shadow-lg shadow-indigo-500/10 dark:border-indigo-800/30'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="relative p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 animate-pulse rounded-full" />
                <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  JanVoice AI Insight
                </h4>
                {isTyping ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-500 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {labels.analyzing}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    AI Detection Active
                  </div>
                )}
              </div>
            </div>

            {detection.confidence > 0 && !isTyping && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                  {labels.confidence}
                </div>
                <div className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                  {detection.confidence}%
                </div>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${detection.confidence}%` }}
                    className={`h-full ${detection.confidence > 80 ? 'bg-emerald-500' : detection.confidence > 60 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Department Badge */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {labels.suggestedDept}
              </span>
              <motion.div 
                layoutId="dept-badge"
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 group hover:border-indigo-500/40 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-indigo-100 dark:border-indigo-900 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {detection.department || '---'}
                </span>
              </motion.div>
            </div>

            {!isTyping && detection.summary && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {labels.summary}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{detection.summary}"
                </p>
              </div>
            )}

            {!isTyping && detection.tags && detection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {detection.tags.map((tag, idx) => (
                  <motion.span 
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-400"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pulse line at bottom */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {isTyping && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/3"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiSuggestionBox;
