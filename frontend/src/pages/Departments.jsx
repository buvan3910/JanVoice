import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Building2, 
  Shield, 
  Car, 
  Zap, 
  Droplets, 
  HeartPulse, 
  GraduationCap, 
  Users, 
  Trees, 
  Construction, 
  Scale, 
  Globe, 
  ArrowRight,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const departmentList = [
  { name: "Revenue Department", icon: Scale, desc: "Land records, taxes, and district administration.", types: ["Land disputes", "Property tax", "Record correction"], color: "blue" },
  { name: "Police Department", icon: Shield, desc: "Law enforcement, safety, and crime reporting.", types: ["Theft", "Public safety", "Harassment"], color: "red" },
  { name: "Transport / RTO", icon: Car, desc: "Vehicle registration, licensing, and road safety.", types: ["License delay", "Permit issues", "Touting"], color: "orange" },
  { name: "KSRTC / Public Transport", icon: Globe, desc: "Karnataka State Road Transport Corporation services.", types: ["Bus delay", "Staff behavior", "Ticket issues"], color: "red" },
  { name: "BBMP / Municipal Services", icon: Building2, desc: "Bruhat Bengaluru Mahanagara Palike civic issues.", types: ["Garbage", "Potholes", "Street lights"], color: "indigo" },
  { name: "BESCOM / Electricity", icon: Zap, desc: "Bangalore Electricity Supply Company services.", types: ["Power cut", "Billing error", "Transformer issue"], color: "yellow" },
  { name: "HESCOM / Electricity (Hubli)", icon: Zap, desc: "Hubli Electricity Supply Company Limited services.", types: ["Power cut", "Billing error", "Transformer issue"], color: "orange" },
  { name: "BWSSB / Water Supply", icon: Droplets, desc: "Bangalore Water Supply and Sewerage Board.", types: ["Water shortage", "Leakage", "Sewerage block"], color: "blue" },
  { name: "Health & Family Welfare", icon: HeartPulse, desc: "Public health services and government hospitals.", types: ["Medical negligence", "Facility issues", "Shortage of meds"], color: "emerald" },
  { name: "Education Department", icon: GraduationCap, desc: "Primary, secondary, and higher education services.", types: ["Admission issues", "Fee regulation", "Infrastructure"], color: "purple" },
  { name: "Women & Child Development", icon: Users, desc: "Social welfare for women and children.", types: ["Anganwadi", "Child safety", "Women welfare schemes"], color: "pink" },
  { name: "Rural Development & PR", icon: Globe, desc: "Rural infrastructure and Panchayat Raj issues.", types: ["Panchayat funds", "Rural roads", "Water supply"], color: "teal" },
  { name: "Forest Department", icon: Trees, desc: "Wildlife protection and forest conservation.", types: ["Illegal logging", "Wildlife encroachment", "Tree felling"], color: "green" },
  { name: "Public Works Department", icon: Construction, desc: "State infrastructure and building maintenance.", types: ["Road construction", "Public buildings", "Bridge repairs"], color: "slate" },
  { name: "Cyber Crime Cell", icon: Shield, desc: "Online fraud and cyber security reporting.", types: ["Online fraud", "Data breach", "Phishing"], color: "rose" },
  { name: "Pollution Control Board", icon: AlertCircle, desc: "Environmental protection and monitoring.", types: ["Air pollution", "Water pollution", "Noise nuisance"], color: "cyan" },
  { name: "Labor Department", icon: Users, desc: "Labor rights and employment disputes.", types: ["Wage disputes", "Workplace safety", "Child labor"], color: "violet" },
  { name: "Housing Board", icon: Building2, desc: "Government housing schemes and maintenance.", types: ["Allotment issues", "Maintenance", "Rent disputes"], color: "amber" },
  { name: "Food & Civil Supplies", icon: Droplets, desc: "Ration cards and essential commodities.", types: ["Ration card", "Fair price shop", "Adulteration"], color: "lime" },
  { name: "Social Welfare Department", icon: Users, desc: "Welfare schemes for underprivileged sections.", types: ["Scholarships", "Caste certificates", "Hostel facilities"], color: "fuchsia" }
];

const translations = {
  English: {
    title: "Explore",
    titleSpan: "Departments",
    subtitle: "Select the specialized Karnataka government body to process your digital grievance.",
    searchPlaceholder: "Search by department or issue type...",
    stats: {
      depts: "Departments",
      nodes: "Active Nodes",
      response: "Avg Response",
      success: "Success Rate"
    },
    reportGrievance: "Report Grievance",
    noResults: "No departments match your query",
    noResultsSub: "Try using broader keywords or explore the list manually.",
    resetSearch: "Reset Search"
  },
  Kannada: {
    title: "ಅನ್ವೇಷಿಸಿ",
    titleSpan: "ಇಲಾಖೆಗಳು",
    subtitle: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ದೂರನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಶೇಷ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    searchPlaceholder: "ಇಲಾಖೆ ಅಥವಾ ಸಮಸ್ಯೆಯ ಪ್ರಕಾರದ ಮೂಲಕ ಹುಡುಕಿ...",
    stats: {
      depts: "ಇಲಾಖೆಗಳು",
      nodes: "ಸಕ್ರಿಯ ನೋಡ್‌ಗಳು",
      response: "ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ",
      success: "ಯಶಸ್ಸಿನ ಪ್ರಮಾಣ"
    },
    reportGrievance: "ದೂರು ಸಲ್ಲಿಸಿ",
    noResults: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಇಲಾಖೆಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
    noResultsSub: "ವಿಶಾಲವಾದ ಕೀವರ್ಡ್‌ಗಳನ್ನು ಬಳಸಲು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಪಟ್ಟಿಯನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ಅನ್ವೇಷಿಸಿ.",
    resetSearch: "ಹುಡುಕಾಟವನ್ನು ಮರುಹೊಂದಿಸಿ"
  }
};

const Departments = ({ language }) => {
  const t = translations[language || 'English'];
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredDepartments = departmentList.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.types.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-10 max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <div className="h-12 w-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-6 w-64 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          </div>
          <div className="h-16 w-80 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem]" />)}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[400px] bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            {t.title} <span className="text-gov-blue-600">{t.titleSpan}</span>
          </motion.h1>
          <p className="text-slate-500 font-medium text-lg">{t.subtitle}</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gov-blue-600 transition-colors" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t.stats.depts, value: departmentList.length, color: "text-gov-blue-600", bg: "bg-gov-blue-50 dark:bg-gov-blue-900/20" },
          { label: t.stats.nodes, value: "18", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20" },
          { label: t.stats.response, value: "24h", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
          { label: t.stats.success, value: "92%", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 ${stat.bg} rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-sm`}
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Department Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredDepartments.map((dept, i) => (
            <motion.div
              key={dept.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="group p-8 glass rounded-[3rem] flex flex-col h-full border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl hover:shadow-gov-blue-100 dark:hover:shadow-none transition-all cursor-pointer relative overflow-hidden"
              onClick={() => navigate('/raise-complaint', { state: { department: dept.name } })}
            >
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <dept.icon size={150} />
              </div>

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-gov-blue-600 group-hover:bg-gov-blue-600 group-hover:text-white transition-all duration-500`}>
                  <dept.icon size={32} />
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter shadow-sm">
                      U{j}
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-gov-blue-600 transition-colors relative z-10">{dept.name}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1 relative z-10">{dept.desc}</p>

              <div className="space-y-6 relative z-10">
                <div className="flex flex-wrap gap-2">
                  {dept.types.map(type => (
                    <span key={type} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 dark:border-slate-700 group-hover:border-gov-blue-200 dark:group-hover:border-gov-blue-900 transition-colors">
                      {type}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-98 shadow-xl">
                  {t.reportGrievance}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDepartments.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 glass rounded-[4rem]"
        >
          <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Search size={48} className="text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t.noResults}</h3>
          <p className="text-slate-500 font-medium text-lg">{t.noResultsSub}</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-10 px-10 py-4 bg-gov-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-gov-blue-700 transition-all shadow-2xl shadow-gov-blue-200"
          >
            {t.resetSearch}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Departments;
