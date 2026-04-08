import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  MapPin, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  Loader2,
  Mic,
  Map,
  Globe,
  UploadCloud,
  FileVideo,
  X,
  ChevronDown,
  Download,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectDepartment, suggestTitle, analyzeComplaint } from '../utils/detectDepartment';
import AiSuggestionBox from '../components/AiSuggestionBox';
import AIAssistant from '../components/AIAssistant';
import { aiClassify, submitComplaint, analyzeImage } from '../api/janvoiceApi';
import LocationPicker from '../components/LocationPicker';

const departments = [
  "Revenue Department",
  "Police Department",
  "Transport / RTO",
  "BBMP / Municipal Services",
  "BESCOM / Electricity",
  "BWSSB / Water Supply",
  "Health & Family Welfare",
  "Education Department",
  "Cyber Crime Cell",
  "Forest Department",
  "Food & Civil Supplies",
  "Labor Department",
  "Women & Child Development",
  "Pollution Control Board",
  "Social Welfare Department",
  "Rural Development & PR"
];

const categories = [
  "Infrastructure",
  "Public Safety",
  "Health & Sanitation",
  "Water & Electricity",
  "Transport & Traffic",
  "Administrative",
  "Environment",
  "Education"
];

const translations = {
  English: {
    title: "Raise Grievance",
    subtitle: "Use AI to report your issue quickly and accurately.",
    aiActive: "JanVoice AI Active",
    formTitle: "Complaint Title",
    formTitlePlaceholder: "e.g., Water leakage in Indiranagar",
    department: "Department",
    selectDept: "Select Department",
    category: "Category",
    selectCat: "Select Category",
    description: "Describe your issue",
    descPlaceholder: "Describe what happened, where, and when...",
    location: "Location & Ward",
    locationPlaceholder: "Enter ward name or area",
    urgency: "Urgency Level",
    languagePref: "Preferred Response Language",
    evidence: "Evidence (Photos & Videos)",
    dragDrop: "Drag & drop files here",
    orBrowse: "or click to browse from your device",
    addPhotos: "Add Photos",
    addVideos: "Add Videos",
    previewDoc: "Preview Document",
    registerGrievance: "Register Grievance",
    submitting: "Submitting...",
    aiAssistantTitle: "JanVoice AI",
    aiOnline: "Always Online",
    aiWelcome: "Hello! I'm your JanVoice AI assistant. Describe your issue in simple words or use the microphone, and I'll help you draft a formal complaint.",
    refineWithAi: "Refine with AI",
    aiInsights: "AI Insights",
    sentiment: "Sentiment",
    resolutionTime: "Resolution Time",
    verifiedReporting: "Verified Reporting",
    verifiedDesc: "Your grievance is digitally signed and tracked. We guarantee a response within 48 business hours.",
    successTitle: "Grievance Registered!",
    successSubtitle: "Your voice has been successfully recorded in the digital ledger.",
    complaintId: "Complaint ID",
    goDashboard: "Go to Dashboard"
  },
  Kannada: {
    title: "ದೂರು ಸಲ್ಲಿಸಿ",
    subtitle: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ತ್ವರಿತವಾಗಿ ಮತ್ತು ನಿಖರವಾಗಿ ವರದಿ ಮಾಡಲು AI ಬಳಸಿ.",
    aiActive: "JanVoice AI ಸಕ್ರಿಯವಾಗಿದೆ",
    formTitle: "ದೂರಿನ ಶೀರ್ಷಿಕೆ",
    formTitlePlaceholder: "ಉದಾಹರಣೆಗೆ: ಇಂದಿರಾನಗರದಲ್ಲಿ ನೀರಿನ ಸೋರಿಕೆ",
    department: "ಇಲಾಖೆ",
    selectDept: "ಇಲಾಖೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    category: "ವರ್ಗ",
    selectCat: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    description: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
    descPlaceholder: "ಏನಾಯಿತು, ಎಲ್ಲಿ ಮತ್ತು ಯಾವಾಗ ಎಂದು ವಿವರಿಸಿ...",
    location: "ಸ್ಥಳ ಮತ್ತು ವಾರ್ಡ್",
    locationPlaceholder: "ವಾರ್ಡ್ ಹೆಸರು ಅಥವಾ ಪ್ರದೇಶವನ್ನು ನಮೂದಿಸಿ",
    urgency: "ತುರ್ತು ಮಟ್ಟ",
    languagePref: "ಆದ್ಯತೆಯ ಪ್ರತಿಕ್ರಿಯೆ ಭಾಷೆ",
    evidence: "ಸಾಕ್ಷ್ಯ (ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳು)",
    dragDrop: "ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಮತ್ತು ಬಿಡಿ",
    orBrowse: "ಅಥವಾ ನಿಮ್ಮ ಸಾಧನದಿಂದ ಬ್ರೌಸ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    addPhotos: "ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ",
    addVideos: "ವೀಡಿಯೊಗಳನ್ನು ಸೇರಿಸಿ",
    previewDoc: "ದಾಖಲೆಯ ಮುನ್ನೋಟ",
    registerGrievance: "ದೂರು ನೋಂದಾಯಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    aiAssistantTitle: "JanVoice AI",
    aiOnline: "ಯಾವಾಗಲೂ ಆನ್‌ಲೈನ್",
    aiWelcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ JanVoice AI ಸಹಾಯಕ. ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ಬಳಸಿ, ಮತ್ತು ನಾನು ಔಪಚಾರಿಕ ದೂರನ್ನು ಸಿದ್ಧಪಡಿಸಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    refineWithAi: "AI ನೊಂದಿಗೆ ಪರಿಷ್ಕರಿಸಿ",
    aiInsights: "AI ಒಳನೋಟಗಳು",
    sentiment: "ಭಾವನೆ",
    resolutionTime: "ಪರಿಹಾರದ ಸಮಯ",
    verifiedReporting: "ಪರಿಶೀಲಿಸಿದ ವರದಿ",
    verifiedDesc: "ನಿಮ್ಮ ದೂರನ್ನು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಸಹಿ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ. ನಾವು 48 ವ್ಯವಹಾರ ಗಂಟೆಗಳ ಒಳಗೆ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಖಾತರಿಪಡಿಸುತ್ತೇವೆ.",
    successTitle: "ದೂರು ನೋಂದಾಯಿಸಲಾಗಿದೆ!",
    successSubtitle: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಡಿಜಿಟಲ್ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.",
    complaintId: "ದೂರು ಐಡಿ",
    goDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ"
  }
};

const RaiseComplaint = ({ language }) => {
  const t = translations[language || 'English'];
  const navigate = useNavigate();
  const locationState = useLocation();
  const [userOverride, setUserOverride] = useState({ department: false, category: false });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: locationState.state?.department || '',
    category: '',
    location: '',
    urgency: 'Medium',
    language: language || 'English'
  });

  const [attachments, setAttachments] = useState({
    photos: [],
    videos: []
  });

  const handleApplyAiRefinement = (analysis) => {
    setFormData(prev => ({
      ...prev,
      description: analysis.formalComplaint || prev.description,
      department: analysis.department || prev.department,
      urgency: analysis.urgency || prev.urgency,
      title: suggestTitle(analysis.formalComplaint || prev.description, analysis.department)
    }));
  };

  const [isRecording, setIsRecording] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Image Analysis State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAnalysisError, setImageAnalysisError] = useState(null);

  // AI Detection State
  const [aiDetection, setAiDetection] = useState({
    department: null,
    confidence: 0,
    tags: [],
    summary: "",
    detected: false
  });
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Debounced AI Detection
  useEffect(() => {
    if (!formData.description || formData.description.length < 10) {
      setAiDetection({
        department: null,
        confidence: 0,
        tags: [],
        summary: "",
        detected: false
      });
      return;
    }

    setIsAiTyping(true);
    const timeoutId = setTimeout(() => {
      const result = detectDepartment(formData.description);
      setAiDetection(result);
      setIsAiTyping(false);

      // Auto-fill department if confidence is high
      if (result.detected && result.confidence > 70 && !formData.department) {
        setFormData(prev => ({ ...prev, department: result.department }));
      }

      // Auto-suggest title if empty
      if (!formData.title && result.detected) {
        setFormData(prev => ({ ...prev, title: suggestTitle(formData.description, result.department) }));
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [formData.description]);

  // Gemini classification (backend), used for auto-selecting Department + Category
  useEffect(() => {
    if (!formData.description || formData.description.trim().length < 10) return;

    let mounted = true;
    const timer = setTimeout(async () => {
      try {
        const res = await aiClassify(formData.description, formData.language);
        if (!mounted) return;

        // Reuse the existing suggestion box UI by shaping data
        setAiDetection(prev => ({
          ...prev,
          department: res.department,
          confidence: Math.round((res.confidence || 0.6) * 100),
          summary: res.summary || prev.summary,
          detected: true
        }));

        setFormData(prev => {
          const next = { ...prev };
          if (!userOverride.department && (!next.department || next.department === '')) {
            next.department = res.department || next.department;
          }
          if (!userOverride.category && (!next.category || next.category === '')) {
            next.category = res.category || next.category;
          }
          if (res.urgency && ['Low', 'Medium', 'High'].includes(res.urgency)) {
            next.urgency = next.urgency || res.urgency;
          }
          if (!next.title && res.suggested_title) {
            next.title = res.suggested_title;
          }
          return next;
        });
      } catch {
        // ignore: fallback UI already uses local keyword detection
      }
    }, 900);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [formData.description, formData.language, userOverride.department, userOverride.category]);

  const handlePreviewOpen = () => {
    setIsPreviewLoading(true);
    setShowPreview(true);
    setTimeout(() => setIsPreviewLoading(false), 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') setUserOverride(prev => ({ ...prev, department: true }));
    if (name === 'category') setUserOverride(prev => ({ ...prev, category: true }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'Kannada' ? 'kn-IN' : 'en-IN';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, description: prev.description + ' ' + transcript }));
    };

    recognition.start();
  };

  // Image Analysis Handler
  const handleImageAnalysis = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageAnalysisError('Invalid image type. Please upload JPG, PNG, or WEBP.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageAnalysisError('Image size exceeds 5MB limit.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setIsAnalyzingImage(true);
    setImageAnalysisError(null);

    try {
      const result = await analyzeImage(file);
      
      // Auto-fill form with AI results
      setFormData(prev => ({
        ...prev,
        description: result.description || prev.description,
        department: result.department || prev.department,
        category: result.category || prev.category,
      }));

      // Update AI detection state
      setAiDetection({
        department: result.department,
        confidence: Math.round((result.confidence || 0.7) * 100),
        tags: [],
        summary: result.description,
        detected: true
      });

      // Add to attachments
      setAttachments(prev => ({
        ...prev,
        photos: [...prev.photos, {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type
        }]
      }));

    } catch (err) {
      setImageAnalysisError(err.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleImageUploadForAnalysis = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageAnalysis(file);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageAnalysisError(null);
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => ({
      ...prev,
      [type]: [...prev[type], ...files.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type
      }))]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const photos = files.filter(f => f.type.startsWith('image/'));
      const videos = files.filter(f => f.type.startsWith('video/'));
      
      setAttachments(prev => ({
        photos: [...prev.photos, ...photos.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', type: f.type }))],
        videos: [...prev.videos, ...videos.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', type: f.type }))]
      }));
    }
  };

  const removeFile = (type, index) => {
    setAttachments(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitComplaint({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        category: formData.category,
        location: formData.location,
        urgency: formData.urgency,
        language: formData.language,
        attachments: attachments,
      });

      // Increment Citizen Score (local gamification)
      const currentScore = parseInt(localStorage.getItem('citizenScore') || '750');
      localStorage.setItem('citizenScore', (currentScore + 50).toString());

      setShowSuccess(true);
      setTimeout(() => navigate('/history'), 1200);
    } catch (err) {
      alert(err?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const urgencyColors = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500 pulse-red'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Bot size={20} className="text-gov-blue-600" />
            {t.aiActive}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="glass p-8 rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.formTitle}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t.formTitlePlaceholder}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-medium"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.department}</label>
                <div className={`relative transition-all duration-500 ${aiDetection.detected && formData.department === aiDetection.department ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 rounded-2xl' : ''}`}>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-bold appearance-none ${aiDetection.detected && formData.department === aiDetection.department ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-700'}`}
                    required
                  >
                    <option value="">{t.selectDept}</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                  <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  
                  {aiDetection.detected && formData.department === aiDetection.department && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg"
                    >
                      <Sparkles size={12} />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.category}</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-bold appearance-none"
                    required
                  >
                    <option value="">{t.selectCat}</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* AI Image Analysis Section */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon size={14} />
                {language === 'Kannada' ? 'ಚಿತ್ರದಿಂದ AI ವಿಶ್ಲೇಷಣೆ' : 'AI Analysis from Image'}
              </label>
              <div className="p-6 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Image Preview */}
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-400 shadow-lg">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <X size={14} />
                      </button>
                      {isAnalyzingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-600 flex items-center justify-center bg-white dark:bg-slate-800">
                      <ImageIcon size={32} className="text-indigo-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        {language === 'Kannada' ? 'ಸಮಸ್ಯೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload Image of Issue'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'Kannada' 
                          ? 'AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಮಸ್ಯೆ, ಇಲಾಖೆ ಮತ್ತು ವರ್ಗವನ್ನು ಪತ್ತೆಹಚ್ಚುತ್ತದೆ' 
                          : 'AI will auto-detect the issue, department and category'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <input
                        type="file"
                        id="ai-image-upload"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageUploadForAnalysis}
                        data-testid="ai-image-upload-input"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('ai-image-upload').click()}
                        disabled={isAnalyzingImage}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none"
                        data-testid="upload-image-btn"
                      >
                        {isAnalyzingImage ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            {language === 'Kannada' ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} />
                            {language === 'Kannada' ? 'ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ' : 'Select Image'}
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        JPG, PNG, WEBP (max 5MB)
                      </span>
                    </div>
                    
                    {/* Error Message */}
                    {imageAnalysisError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-xs font-medium"
                      >
                        <AlertCircle size={14} />
                        {imageAnalysisError}
                      </motion.div>
                    )}
                    
                    {/* Success Indicator */}
                    {imagePreview && !isAnalyzingImage && !imageAnalysisError && formData.description && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-green-600 text-xs font-medium"
                      >
                        <CheckCircle2 size={14} />
                        {language === 'Kannada' ? 'ಸಮಸ್ಯೆ ಯಶಸ್ವಿಯಾಗಿ ಪತ್ತೆಯಾಗಿದೆ!' : 'Issue detected successfully!'}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.description}</label>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formData.description.length}/1000</span>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gov-blue-50 dark:bg-gov-blue-900/30 text-gov-blue-600'}`}
                  >
                    <Mic size={18} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder={t.descPlaceholder}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-medium resize-none"
                  required
                />
                <AnimatePresence>
                  {isRecording && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-4 right-4 flex items-center gap-1"
                    >
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 16, 8] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-red-500 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Auto Department Detection UI */}
               <AiSuggestionBox 
                 detection={aiDetection} 
                 isTyping={isAiTyping} 
                 language={language}
                 descriptionLength={formData.description.length}
               />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.location}</label>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'Kannada'
                      ? 'ಸ್ಥಳವನ್ನು ಹುಡುಕಿ ಅಥವಾ ನಕ್ಷೆಯಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.'
                      : 'Search a place (min 3 letters) or click on the map.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    {showMap ? (language === 'Kannada' ? 'ಮರೆಮಾಡಿ' : 'Hide') : (language === 'Kannada' ? 'ನಕ್ಷೆ' : 'Map')}
                  </button>
                </div>

                <LocationPicker
                  value={formData.location}
                  onChange={(v) => setFormData(prev => ({ ...prev, location: v }))}
                  language={language}
                  showMap={showMap}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                  {t.urgency}
                  <div className={`w-3 h-3 rounded-full ${urgencyColors[formData.urgency]}`} />
                </label>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {['Low', 'Medium', 'High'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        formData.urgency === level 
                        ? 'bg-white dark:bg-slate-700 text-gov-blue-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {level === 'Low' ? (language === 'Kannada' ? 'ಕಡಿಮೆ' : 'Low') : 
                       level === 'Medium' ? (language === 'Kannada' ? 'ಮಧ್ಯಮ' : 'Medium') : 
                       (language === 'Kannada' ? 'ಹೆಚ್ಚು' : 'High')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.languagePref}</label>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {['English', 'Kannada'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        formData.language === lang 
                        ? 'bg-white dark:bg-slate-700 text-gov-blue-600 shadow-sm' 
                        : 'text-slate-500'
                      }`}
                    >
                      {lang === 'English' ? 'English' : 'ಕನ್ನಡ'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'Kannada' ? 'AI ಸಲಹೆ' : 'AI Suggestion'}</label>
                <div className="p-4 bg-gov-blue-50 dark:bg-gov-blue-900/20 border border-gov-blue-100 dark:border-gov-blue-800 rounded-2xl flex items-center gap-3">
                  <Sparkles size={16} className="text-gov-blue-600" />
                  <p className="text-[10px] font-bold text-gov-blue-600">
                    {language === 'Kannada' ? 'ನಿಜಾವಧಿಯ ಸಲಹೆಗಳನ್ನು ನೀಡಲು AI ನಿಮ್ಮ ಇನ್‌ಪುಟ್ ಅನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತಿದೆ.' : 'AI is monitoring your input to provide real-time suggestions.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.evidence}</label>
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-10 border-4 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center text-center gap-4 ${
                  dragActive ? 'border-gov-blue-600 bg-gov-blue-50 dark:bg-gov-blue-900/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-gov-blue-600">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{t.dragDrop}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">{t.orBrowse}</p>
                </div>
                <div className="flex gap-4 mt-2">
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'photos')}
                  />
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('photo-upload').click()}
                    className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {t.addPhotos}
                  </button>
                  
                  <input
                    type="file"
                    id="video-upload"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'videos')}
                  />
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('video-upload').click()}
                    className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {t.addVideos}
                  </button>
                </div>
              </div>

              {/* File Previews */}
              <AnimatePresence>
                {[...attachments.photos, ...attachments.videos].length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
                  >
                    {[...attachments.photos, ...attachments.videos].map((file, idx) => (
                      <motion.div 
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                      >
                        {file.type.startsWith('image/') ? (
                          <div className="w-10 h-10 bg-gov-blue-50 dark:bg-gov-blue-900/30 text-gov-blue-600 rounded-xl flex items-center justify-center mb-2">
                            <ImageIcon size={24} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-2">
                            <FileVideo size={24} />
                          </div>
                        )}
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full px-2">{file.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">{file.size}</p>
                        <button 
                          type="button" 
                          onClick={() => removeFile(file.type.startsWith('image/') ? 'photos' : 'videos', attachments.photos.includes(file) ? attachments.photos.indexOf(file) : attachments.videos.indexOf(file))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handlePreviewOpen}
                disabled={!formData.title || !formData.description}
                className="flex-1 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[2rem] font-black text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm disabled:opacity-50 ripple"
              >
                {t.previewDoc}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-5 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-gov-blue-200 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-70 group ripple"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {t.submitting}
                  </>
                ) : (
                  <>
                    {t.registerGrievance}
                    <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-4 h-full">
          <AIAssistant 
            language={language} 
            onApplyRefinement={handleApplyAiRefinement}
            initialDescription={formData.description}
          />
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="text-gov-blue-600" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">{language === 'Kannada' ? 'ಔಪಚಾರಿಕ ದಾಖಲೆಯ ಮುನ್ನೋಟ' : 'Formal Document Preview'}</h3>
                </div>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
                {isPreviewLoading ? (
                  <div 
                    style={{ aspectRatio: '1/1.414' }}
                    className="bg-white dark:bg-slate-900 shadow-2xl p-10 border border-slate-200 dark:border-slate-800 mx-auto max-w-md flex flex-col animate-pulse space-y-8"
                  >
                    <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 pb-6">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="space-y-2">
                        <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="w-16 h-2 bg-slate-50 dark:bg-slate-900 rounded" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="space-y-6 pt-10">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-3 w-full bg-slate-50 dark:bg-slate-900 rounded" />)}
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ aspectRatio: '1/1.414' }}
                    className="bg-white dark:bg-slate-900 shadow-2xl p-10 border border-slate-200 dark:border-slate-800 mx-auto max-w-md flex flex-col"
                  >
                    <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-white pb-6 mb-8">
                      <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-900 font-black text-2xl">J</div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest">{language === 'Kannada' ? 'JanVoice AI ಅಧಿಕೃತ' : 'JanVoice AI Official'}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">{language === 'Kannada' ? 'ದೂರು ವರದಿ v1.0' : 'Grievance Report v1.0'}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'Kannada' ? 'ವಿಷಯ' : 'Subject'}</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{formData.title}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'Kannada' ? 'ಇಲಾಖೆ' : 'Department'}</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formData.department}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'Kannada' ? 'ವಿವರಣೆ' : 'Description'}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                          {aiAssistant.insights?.refinedVersion || formData.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'Kannada' ? 'ಸ್ಥಳ' : 'Location'}</p>
                          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{formData.location}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'Kannada' ? 'ದಿನಾಂಕ' : 'Date'}</p>
                          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-12 flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="w-20 h-[1px] bg-slate-400" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{language === 'Kannada' ? 'ನಾಗರಿಕ ಸಹಿ' : 'Citizen Signature'}</p>
                      </div>
                      <div className="w-16 h-16 opacity-10">
                        <Globe size={64} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-white dark:bg-slate-900">
                <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />
                  {language === 'Kannada' ? 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'Download PDF'}
                </button>
                <button 
                  onClick={() => {
                    if (aiAssistant.insights) setFormData(prev => ({ ...prev, description: aiAssistant.insights.refinedVersion }));
                    setShowPreview(false);
                  }}
                  className="flex-1 py-4 bg-gov-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gov-blue-700 transition-all shadow-lg shadow-gov-blue-200 dark:shadow-none"
                >
                  {language === 'Kannada' ? 'ಪರಿಷ್ಕರಣೆಯನ್ನು ಅನ್ವಯಿಸಿ' : 'Apply Refinement'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
              <div className="w-24 h-24 bg-green-100 dark:bg-green-950/30 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{t.successTitle}</h3>
              <p className="text-slate-500 mb-10 font-medium text-lg">{t.successSubtitle}</p>
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl mb-10 border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t.complaintId}</p>
                <p className="text-3xl font-black text-gov-blue-600 tracking-wider">JV-{Math.floor(10000 + Math.random() * 90000)}</p>
              </div>
              <button 
                onClick={() => navigate('/history')}
                className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl font-black text-lg transition-all hover:scale-[1.02] shadow-xl"
              >
                {t.goDashboard}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RaiseComplaint;
