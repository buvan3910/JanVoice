import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Tag, 
  FileText,
  Loader2,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  Check
} from 'lucide-react';

const AIAnalysisCard = ({ analysis, isAnalyzing, language }) => {
  const [copied, setCopied] = React.useState(false);

  const t = {
    English: {
      analyzing: "AI is analyzing your input...",
      detectedDept: "Detected Department",
      confidence: "Confidence",
      urgency: "Urgency Level",
      tags: "Issue Tags",
      summary: "AI Summary",
      formalVersion: "Suggested Formal Complaint",
      lowConfidence: "AI is not fully confident. Please choose a department manually.",
      copy: "Copy Text",
      copied: "Copied!"
    },
    Kannada: {
      analyzing: "AI ನಿಮ್ಮ ಇನ್‌ಪುಟ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      detectedDept: "ಪತ್ತೆಯಾದ ಇಲಾಖೆ",
      confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
      urgency: "ತುರ್ತು ಮಟ್ಟ",
      tags: "ಸಮಸ್ಯೆಯ ಟ್ಯಾಗ್‌ಗಳು",
      summary: "AI ಸಾರಾಂಶ",
      formalVersion: "ಸೂಚಿಸಲಾದ ಔಪಚಾರಿಕ ದೂರು",
      lowConfidence: "AI ಸಂಪೂರ್ಣ ವಿಶ್ವಾಸ ಹೊಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಹಸ್ತಚಾಲಿತವಾಗಿ ಇಲಾಖೆಯನ್ನು ಆರಿಸಿ.",
      copy: "ಪಠ್ಯವನ್ನು ನಕಲಿಸಿ",
      copied: "ನಕಲಿಸಲಾಗಿದೆ!"
    }
  };

  const labels = t[language || 'English'];

  const urgencyStyles = {
    High: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
    Low: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
  };

  const copyToClipboard = () => {
    if (!analysis.formalComplaint) return;
    navigator.clipboard.writeText(analysis.formalComplaint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-3"
          >
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {labels.analyzing}
            </span>
          </motion.div>
        ) : analysis.detected ? (
          <motion.div
            key="analysis-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl overflow-hidden border-indigo-500/20 shadow-xl shadow-indigo-500/5"
          >
            {/* Header with Confidence */}
            <div className="p-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-indigo-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  AI Insight
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {labels.confidence}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {analysis.confidence}%
                  </span>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.confidence}%` }}
                      className="h-full bg-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Department and Urgency Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {labels.detectedDept}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {analysis.department}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {labels.urgency}
                  </span>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${urgencyStyles[analysis.urgency]}`}>
                    {analysis.urgency === 'High' && <AlertTriangle className="w-3 h-3" />}
                    {analysis.urgency}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  {labels.tags}
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> {labels.summary}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{analysis.summary}"
                </p>
              </div>

              {/* Formal Complaint */}
              {analysis.formalComplaint && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ClipboardCheck className="w-3 h-3" /> {labels.formalVersion}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {copied ? labels.copied : labels.copy}
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {analysis.formalComplaint}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Low Confidence Warning */}
            {analysis.confidence < 60 && (
              <div className="px-5 py-3 bg-amber-500/10 border-t border-amber-500/10 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500">
                  {labels.lowConfidence}
                </span>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AIAnalysisCard;
