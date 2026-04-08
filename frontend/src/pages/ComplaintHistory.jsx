import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X,
  Calendar,
  MapPin,
  Building2,
  Bot,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  Inbox,
  Share2,
  Download,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

import { getComplaints } from '../api/janvoiceApi';

const translations = {
  English: {
    title: "Audit History",
    subtitle: "Track the digital lifecycle of your reported grievances.",
    searchPlaceholder: "Search ID, Title, or Dept...",
    all: "All",
    pending: "Pending",
    inProgress: "In Progress",
    resolved: "Resolved",
    allDepts: "All Departments",
    complaintDetails: "Complaint Details",
    department: "Department",
    status: "Status",
    submissionDate: "Submission Date",
    verification: "Verification",
    noRecords: "No records found",
    noRecordsSub: "We couldn't find any complaints matching your current filters.",
    clearFilters: "Clear all filters",
    digitalSign: "Digital Sign: Verified",
    responsibleDept: "Responsible Department",
    incidentLocation: "Incident Location",
    grievanceDescription: "Grievance Description",
    digitalEvidence: "Digital Evidence",
    resolutionProgress: "Resolution Progress",
    aiAuditReport: "AI Audit Report",
    executiveSummary: "Executive Summary",
    keyMetrics: "Key Metrics",
    urgency: "Urgency",
    reliability: "Reliability",
    officialResponse: "Official Response",
    downloadPDF: "Download PDF Report",
    shareUpdate: "Share Update"
  },
  Kannada: {
    title: "ದೂರು ಇತಿಹಾಸ",
    subtitle: "ನಿಮ್ಮ ವರದಿಯಾದ ದೂರುಗಳ ಡಿಜಿಟಲ್ ಜೀವನಚಕ್ರವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    searchPlaceholder: "ಐಡಿ, ಶೀರ್ಷಿಕೆ ಅಥವಾ ಇಲಾಖೆಯನ್ನು ಹುಡುಕಿ...",
    all: "ಎಲ್ಲಾ",
    pending: "ಬಾಕಿ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    allDepts: "ಎಲ್ಲಾ ಇಲಾಖೆಗಳು",
    complaintDetails: "ದೂರಿನ ವಿವರಗಳು",
    department: "ಇಲಾಖೆ",
    status: "ಸ್ಥಿತಿ",
    submissionDate: "ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ",
    verification: "ಪರಿಶೀಲನೆ",
    noRecords: "ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    noRecordsSub: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ದೂರುಗಳು ನಮಗೆ ಕಂಡುಬಂದಿಲ್ಲ.",
    clearFilters: "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
    digitalSign: "ಡಿಜಿಟಲ್ ಸಹಿ: ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    responsibleDept: "ಜವಾಬ್ದಾರಿಯುತ ಇಲಾಖೆ",
    incidentLocation: "ಘಟನೆಯ ಸ್ಥಳ",
    grievanceDescription: "ದೂರಿನ ವಿವರಣೆ",
    digitalEvidence: "ಡಿಜಿಟಲ್ ಪುರಾವೆ",
    resolutionProgress: "ಪರಿಹಾರ ಪ್ರಗತಿ",
    aiAuditReport: "AI ಆಡಿಟ್ ವರದಿ",
    executiveSummary: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ",
    keyMetrics: "ಪ್ರಮುಖ ಮೆಟ್ರಿಕ್‌ಗಳು",
    urgency: "ತುರ್ತು",
    reliability: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    officialResponse: "ಅಧಿಕೃತ ಪ್ರತಿಕ್ರಿಯೆ",
    downloadPDF: "PDF ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    shareUpdate: "ನವೀಕರಣವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ"
  }
};

const ComplaintHistory = ({ language }) => {
  const t = translations[language || 'English'];
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getComplaints()
      .then((items) => {
        if (!mounted) return;
        setComplaints(items);
      })
      .catch(() => {
        if (!mounted) return;
        setComplaints([]);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesDept = filterDept === 'All' || c.department.includes(filterDept);
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-600 border-green-200';
      case 'In Progress': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Forwarded': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusText = (status) => {
    if (language !== 'Kannada') return status;
    switch (status) {
      case 'Resolved': return t.resolved;
      case 'In Progress': return t.inProgress;
      case 'Forwarded': return t.forwarded;
      case 'Pending': return t.pending;
      default: return status;
    }
  };

  const departments = [...new Set(complaints.map(c => c.department))];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gov-blue-600 transition-colors" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white w-full sm:w-80 shadow-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setFilterStatus('All')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === 'All' ? 'bg-white dark:bg-slate-700 text-gov-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            {t.all}
          </button>
          {['Pending', 'In Progress', 'Resolved'].map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-white dark:bg-slate-700 text-gov-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              {getStatusText(status)}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white appearance-none text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <option value="All">{t.allDepts}</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Complaints List */}
      <div className="glass rounded-[3rem] overflow-hidden border-slate-200/50 dark:border-slate-800/50">
        <div className="hidden lg:grid grid-cols-12 gap-4 p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.complaintDetails}</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.department}</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.status}</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{t.submissionDate}</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t.verification}</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-8 animate-pulse grid grid-cols-12 gap-4">
                  <div className="col-span-4 flex gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-20 h-3 bg-slate-100 dark:bg-slate-900 rounded" />
                    </div>
                  </div>
                  <div className="col-span-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl" />
                </div>
              ))
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all items-center group cursor-pointer"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="col-span-1 lg:col-span-4 flex items-center gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-gov-blue-600 font-black text-sm group-hover:scale-110 transition-transform">
                      {complaint.department.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gov-blue-600 uppercase tracking-widest mb-1">{complaint.id}</p>
                      <h3 className="font-black text-slate-900 dark:text-white group-hover:text-gov-blue-600 transition-colors truncate text-lg leading-tight">{complaint.title}</h3>
                    </div>
                  </div>

                  <div className="col-span-1 lg:col-span-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Building2 size={18} className="text-slate-400" />
                    {complaint.department}
                  </div>

                  <div className="col-span-1 lg:col-span-2">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border ${getStatusStyle(complaint.status)} shadow-sm inline-block`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>

                  <div className="col-span-1 lg:col-span-2 text-center text-sm text-slate-500 font-black uppercase tracking-widest">
                    {complaint.date}
                  </div>

                  <div className="col-span-1 lg:col-span-2 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className={`w-2 h-2 rounded-full ${complaint.priority === 'High' ? 'bg-red-500' : 'bg-gov-blue-500'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.digitalSign}</span>
                      <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 group-hover:text-gov-blue-600 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Inbox size={48} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{t.noRecords}</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">{t.noRecordsSub}</p>
                <button 
                  onClick={() => {setSearchQuery(''); setFilterStatus('All'); setFilterDept('All');}}
                  className="mt-8 px-8 py-3 bg-gov-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gov-blue-700 transition-all shadow-lg shadow-gov-blue-200"
                >
                  {t.clearFilters}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Content Side */}
              <div className="flex-1 p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedComplaint.status)} shadow-sm`}>
                      {getStatusText(selectedComplaint.status)}
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{selectedComplaint.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">{selectedComplaint.title}</h2>
                
                <div className="grid grid-cols-2 gap-10 mb-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.responsibleDept}</p>
                    <div className="flex items-center gap-3 font-black text-slate-700 dark:text-slate-300">
                      <div className="w-8 h-8 bg-gov-blue-50 dark:bg-gov-blue-900/30 text-gov-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      {selectedComplaint.department}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.incidentLocation}</p>
                    <div className="flex items-center gap-3 font-black text-slate-700 dark:text-slate-300">
                      <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      {selectedComplaint.location || 'Hubballi-Dharwad'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.grievanceDescription}</p>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>

                {selectedComplaint.attachments && (selectedComplaint.attachments.photos.length > 0 || selectedComplaint.attachments.videos.length > 0) && (
                  <div className="space-y-4 mb-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.digitalEvidence}</p>
                    <div className="flex flex-wrap gap-4">
                      {selectedComplaint.attachments.photos.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-gov-blue-600 transition-colors group">
                          <ImageIcon size={20} className="text-gov-blue-600" />
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[150px] uppercase tracking-widest">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.resolutionProgress}</p>
                  <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                    {[
                      { status: 'Complaint Registered', date: selectedComplaint.date, active: true, desc: 'Logged in JanVoice Digital Ledger' },
                      { status: 'Assigned to Officer', date: 'Processing', active: selectedComplaint.status !== 'Pending', desc: 'Officer ID: HD-2938 assigned' },
                      { status: 'On-site Inspection', date: 'TBD', active: selectedComplaint.status === 'Resolved', desc: 'Physical verification by department' }
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-8 relative">
                        <div className={`w-6 h-6 rounded-full z-10 border-4 border-white dark:border-slate-900 shadow-sm ${
                          step.active ? 'bg-gov-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                        <div>
                          <p className={`text-sm font-black uppercase tracking-widest ${step.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.status}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{step.desc} • {step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - AI Insights */}
              <div className="w-full md:w-96 bg-slate-50 dark:bg-slate-800/50 p-10 border-l border-slate-100 dark:border-slate-800 flex flex-col gap-8 overflow-y-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gov-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gov-blue-200 dark:shadow-none">
                    <Bot size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.aiAuditReport}</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm space-y-6 border border-slate-100 dark:border-slate-700">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.executiveSummary}</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "Report identifies potential violation of civic infrastructure standards. Automated routing established to Tier-1 {selectedComplaint.department} supervisor."
                      </p>
                    </div>
                    
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.keyMetrics}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.urgency}</span>
                        <span className="text-xs font-black text-red-500">8.4 / 10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.reliability}</span>
                        <span className="text-xs font-black text-green-500">98%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gov-blue-600 text-white rounded-[2rem] shadow-xl shadow-gov-blue-100 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <MessageSquare size={60} />
                    </div>
                    <h4 className="text-sm font-black mb-3 flex items-center gap-2 uppercase tracking-widest">
                      <ShieldCheck size={18} />
                      {t.officialResponse}
                    </h4>
                    <p className="text-xs text-gov-blue-50 leading-relaxed font-bold italic">
                      {selectedComplaint.status === 'Resolved' 
                        ? "Case closed. Site verification successful. Citizen feedback pending."
                        : "Initial assessment complete. Field officer assigned for physical audit."}
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <Download size={18} />
                    {t.downloadPDF}
                  </button>
                  <button className="w-full py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    {t.shareUpdate}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintHistory;
