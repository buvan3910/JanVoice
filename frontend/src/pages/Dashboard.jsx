import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight,
  Filter,
  Trophy,
  Zap,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { getComplaints } from '../api/janvoiceApi';

const translations = {
  English: {
    welcome: "Namaskara",
    topCitizen: "You're in the top",
    activeCitizens: "active citizens",
    points: "Points",
    raiseComplaint: "Raise Complaint",
    totalComplaints: "Total Complaints",
    pending: "Pending",
    inProgress: "In Progress",
    resolved: "Resolved",
    densityTitle: "Complaint Density",
    densitySubtitle: "Area-wise heat map of reported grievances",
    map: "Map",
    list: "List",
    bookmarks: "Bookmarks",
    weeklyChallenge: "Weekly Challenge",
    challengeDesc: "Verify 3 resolved complaints in your area to earn the \"Guardian\" badge.",
    recentGrievances: "Recent Activity",
    recentSubtitle: "Live feed of digital grievance ledger.",
    viewAll: "View All",
    noBookmarks: "No bookmarked complaints yet."
  },
  Kannada: {
    welcome: "ನಮಸ್ಕಾರ",
    topCitizen: "ನೀವು ಅಗ್ರ",
    activeCitizens: "ಸಕ್ರಿಯ ನಾಗರಿಕರಲ್ಲಿ ಒಬ್ಬರು",
    points: "ಅಂಕಗಳು",
    raiseComplaint: "ದೂರು ಸಲ್ಲಿಸಿ",
    totalComplaints: "ಒಟ್ಟು ದೂರುಗಳು",
    pending: "ಬಾಕಿ ಉಳಿದಿದೆ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    densityTitle: "ದೂರು ಸಾಂದ್ರತೆ",
    densitySubtitle: "ವರದಿಯಾದ ದೂರುಗಳ ಪ್ರದೇಶವಾರು ಹೀಟ್ ಮ್ಯಾಪ್",
    map: "ನಕ್ಷೆ",
    list: "ಪಟ್ಟಿ",
    bookmarks: "ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು",
    weeklyChallenge: "ವಾರದ ಸವಾಲು",
    challengeDesc: "\"ಗಾರ್ಡಿಯನ್\" ಬ್ಯಾಡ್ಜ್ ಗಳಿಸಲು ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ 3 ಪರಿಹರಿಸಲಾದ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    recentGrievances: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    recentSubtitle: "ಡಿಜಿಟಲ್ ದೂರು ಲೆಡ್ಜರ್‌ನ ನೇರ ಫೀಡ್.",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    noBookmarks: "ಇನ್ನೂ ಯಾವುದೇ ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಿದ ದೂರುಗಳಿಲ್ಲ."
  }
};

const Dashboard = ({ language }) => {
  const t = translations[language || 'English'];
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [isLoading, setIsLoading] = useState(true);
  const [citizenScore, setCitizenScore] = useState(localStorage.getItem('citizenScore') || '750');

  useEffect(() => {
    let mounted = true;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

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

  const toggleBookmark = (id) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const stats = [
    { label: t.totalComplaints, value: complaints.length + 12, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: t.pending, value: complaints.filter(c => c.status === 'Pending').length + 4, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: t.inProgress, value: 5, icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: t.resolved, value: 3, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const chartData = [
    { name: 'Koramangala', complaints: 45, density: 80 },
    { name: 'Indiranagar', complaints: 32, density: 60 },
    { name: 'Whitefield', complaints: 58, density: 95 },
    { name: 'Jayanagar', complaints: 28, density: 40 },
    { name: 'Electronic City', complaints: 42, density: 75 },
    { name: 'Malleshwaram', complaints: 25, density: 35 },
  ];

  const trendData = [
    { name: 'Jan', count: 400 },
    { name: 'Feb', count: 300 },
    { name: 'Mar', count: 600 },
    { name: 'Apr', count: 800 },
  ];

  const recentComplaints = [
    { id: 'JV-82734', title: 'Street Light Not Working', dept: 'BESCOM', status: 'In Progress', date: '2026-04-05' },
    { id: 'JV-82735', title: 'Pothole on Outer Ring Road', dept: 'BBMP', status: 'Pending', date: '2026-04-04' },
    { id: 'JV-82736', title: 'Water Leakage in Pipeline', dept: 'BWSSB', status: 'Resolved', date: '2026-04-02' },
    ...complaints.map(c => ({
      id: c.id,
      title: c.title,
      dept: c.department,
      status: c.status,
      date: c.date
    }))
  ].slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-10 max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          </div>
          <div className="h-14 w-48 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 h-[500px] bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]" />
          <div className="col-span-4 h-[500px] bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Welcome & Gamification Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 dark:text-white mb-2"
          >
            {t.welcome}, {user?.fullName?.split(' ')[0] || 'Citizen'}!
          </motion.h1>
          <div className="flex items-center gap-3">
            <p className="text-slate-500 font-medium">{t.topCitizen} <span className="text-gov-blue-600 font-bold">5% {t.activeCitizens}</span>.</p>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <p className="text-gov-blue-600 font-black flex items-center gap-1">
              <Zap size={14} fill="currentColor" />
              {citizenScore} {t.points}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                whileHover={{ y: -5, zIndex: 10 }}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-gov-blue-600"
              >
                <Trophy size={20} />
              </motion.div>
            ))}
            <div className="w-12 h-12 rounded-2xl bg-gov-blue-600 shadow-xl border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-white text-xs font-black">
              +4
            </div>
          </div>
          <Link 
            to="/raise-complaint"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-[2rem] font-black transition-all shadow-2xl shadow-gov-blue-200 dark:shadow-none hover:scale-105 active:scale-95 ripple"
          >
            <Plus size={24} />
            {t.raiseComplaint}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <stat.icon size={120} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                <stat.icon size={28} />
              </div>
              <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-xl flex items-center gap-1 uppercase tracking-widest">
                <ArrowUpRight size={12} />
                +12%
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Insights Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Heatmap/Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-10 glass rounded-[3rem] border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t.densityTitle}</h3>
                <p className="text-sm text-slate-500 font-medium">{t.densitySubtitle}</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-700 shadow-sm rounded-lg text-gov-blue-600">{t.map}</button>
                <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">{t.list}</button>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass p-4 rounded-2xl shadow-2xl border-none">
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase mb-2">{payload[0].payload.name}</p>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-500">{t.totalComplaints}: <span className="text-gov-blue-600">{payload[0].value}</span></p>
                              <p className="text-[10px] font-bold text-slate-500">Risk Level: <span className={payload[0].payload.density > 70 ? 'text-red-500' : 'text-green-500'}>{payload[0].payload.density}%</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="complaints" 
                    radius={[10, 10, 10, 10]} 
                    barSize={40}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.density > 70 ? '#ef4444' : entry.density > 40 ? '#f59e0b' : '#3b82f6'} 
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 glass rounded-[2.5rem]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Bookmark size={24} />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">{t.bookmarks}</h4>
              </div>
              <div className="space-y-4">
                {bookmarks.length > 0 ? (
                  bookmarks.map(id => {
                    const complaint = [...complaints, ...recentComplaints].find(c => c.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-gov-blue-200 transition-all cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gov-blue-600 uppercase tracking-widest">{id}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{complaint?.title || 'Complaint Record'}</span>
                        </div>
                        <button onClick={() => toggleBookmark(id)} className="text-purple-600 hover:scale-110 transition-transform">
                          <Bookmark size={16} fill="currentColor" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-400 font-medium italic">{t.noBookmarks}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 glass rounded-[2.5rem] bg-gradient-to-br from-gov-blue-600 to-blue-500 text-white">
              <h4 className="text-xl font-black mb-4">{t.weeklyChallenge}</h4>
              <p className="text-sm text-gov-blue-100 mb-6 leading-relaxed font-medium">{t.challengeDesc}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gov-blue-100">Progress</span>
                <span className="text-[10px] font-black text-white">2/3</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[66%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 glass rounded-[3rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.recentGrievances}</h3>
              <Link to="/history" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gov-blue-600">
                <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="space-y-6">
              {recentComplaints.map((complaint, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-gov-blue-600 font-black text-xs group-hover:scale-110 transition-transform">
                      {complaint.dept.substring(0, 2)}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                      complaint.status === 'Resolved' ? 'bg-green-500' :
                      complaint.status === 'In Progress' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <span className="hidden">{complaint.status === 'Resolved' ? (language === 'Kannada' ? 'ಪರಿಹರಿಸಲಾಗಿದೆ' : 'Resolved') : 
                         complaint.status === 'In Progress' ? (language === 'Kannada' ? 'ಪ್ರಗತಿಯಲ್ಲಿದೆ' : 'In Progress') : 
                         (language === 'Kannada' ? 'ಬಾಕಿ' : 'Pending')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm truncate group-hover:text-gov-blue-600 transition-colors">{complaint.title}</h4>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(complaint.id);
                        }}
                        className={`transition-colors ${bookmarks.includes(complaint.id) ? 'text-purple-600' : 'text-slate-300 hover:text-purple-400'}`}
                      >
                        <Bookmark size={14} fill={bookmarks.includes(complaint.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{complaint.dept} • {complaint.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 transition-all border border-slate-100 dark:border-slate-700">
              {t.viewAll}
            </button>
          </div>

          {/* Citizen Score Card */}
          <div className="p-8 glass rounded-[3rem] border-gov-blue-100 dark:border-gov-blue-900/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap size={80} className="text-gov-blue-600" />
            </div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Citizen Authority</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-gov-blue-600">Level 4</span>
              <span className="text-xs font-black text-slate-400 mb-2">/ 10</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-6">750 Experience Points earned through active reporting and verification.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Next Level</span>
                <span>250 XP left</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-gov-blue-600 to-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
