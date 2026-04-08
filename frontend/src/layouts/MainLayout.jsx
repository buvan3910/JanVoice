import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Building2, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User,
  Bot,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  English: {
    dashboard: "Dashboard",
    raiseComplaint: "Raise Complaint",
    departments: "Departments",
    history: "Complaint History",
    settings: "Settings",
    logout: "Logout",
    citizenScore: "Citizen Score",
    civicHero: "Civic Hero Badge",
    ptsAway: "pts away",
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    viewAll: "View All Notifications",
    searchPlaceholder: "Search complaints...",
    welcome: "Welcome"
  },
  Kannada: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    raiseComplaint: "ದೂರು ಸಲ್ಲಿಸಿ",
    departments: "ಇಲಾಖೆಗಳು",
    history: "ದೂರು ಇತಿಹಾಸ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ನಿರ್ಗಮಿಸಿ",
    citizenScore: "ನಾಗರಿಕ ಸ್ಕೋರ್",
    civicHero: "ಸಿವಿಕ್ ಹೀರೋ ಬ್ಯಾಡ್ಜ್",
    ptsAway: "ಅಂಕಗಳು ಬಾಕಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ",
    viewAll: "ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ನೋಡಿ",
    searchPlaceholder: "ದೂರುಗಳನ್ನು ಹುಡುಕಿ...",
    welcome: "ನಮಸ್ಕಾರ"
  }
};

const MainLayout = ({ children, setIsAuthenticated, theme, toggleTheme, language, changeLanguage }) => {
  const t = translations[language || 'English'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: language === 'Kannada' ? "ದೂರು ನವೀಕರಿಸಲಾಗಿದೆ" : "Complaint Updated", message: language === 'Kannada' ? "ನಿಮ್ಮ ಬೀದಿ ದೀಪದ ದೂರು ಈಗ ಪ್ರಗತಿಯಲ್ಲಿದೆ" : "Your street light complaint is now In Progress", time: "2 mins ago", read: false },
    { id: 2, title: language === 'Kannada' ? "ಹೊಸ ವೈಶಿಷ್ಟ್ಯ" : "New Feature", message: language === 'Kannada' ? "ಹೊಸ AI ಧ್ವನಿ ವರದಿಯನ್ನು ಪ್ರಯತ್ನಿಸಿ!" : "Try the new AI voice reporting!", time: "1 hour ago", read: false },
    { id: 3, title: language === 'Kannada' ? "ಪರಿಹರಿಸಲಾಗಿದೆ" : "Resolved", message: language === 'Kannada' ? "ನೀರಿನ ಸೋರಿಕೆ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲಾಗಿದೆ" : "Water leakage issue has been resolved", time: "5 hours ago", read: true },
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [citizenScore, setCitizenScore] = useState(localStorage.getItem('citizenScore') || '750');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Listen for storage changes to update score
    const handleStorageChange = () => {
      setCitizenScore(localStorage.getItem('citizenScore') || '750');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const menuItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: '/dashboard' },
    { name: t.raiseComplaint, icon: PlusCircle, path: '/raise-complaint' },
    { name: t.departments, icon: Building2, path: '/departments' },
    { name: t.history, icon: History, path: '/history' },
    { name: t.settings, icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-50 transition-all duration-300 glass border-r border-slate-200 dark:border-slate-800 hidden md:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer"
            >
              J
            </motion.div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-xl tracking-tight text-gov-blue-900 dark:text-white"
                >
                  JanVoice AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                  location.pathname === item.path
                    ? 'bg-gov-blue-600 text-white shadow-lg shadow-gov-blue-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gov-blue-600 rounded-xl -z-10"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Citizen Score (Gamification) */}
          {isSidebarOpen && (
            <div className="px-6 py-4 mx-4 mb-4 bg-gov-blue-50 dark:bg-gov-blue-900/20 rounded-2xl border border-gov-blue-100 dark:border-gov-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gov-blue-600 dark:text-gov-blue-400 uppercase tracking-wider">{t.citizenScore}</span>
                <span className="text-xs font-bold text-gov-blue-900 dark:text-white">{citizenScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(parseInt(citizenScore) / 1000) * 100}%` }}
                  className="h-full bg-gov-blue-600"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">{t.civicHero}: {1000 - parseInt(citizenScore)} {t.ptsAway}</p>
            </div>
          )}

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">{t.logout}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-[70] md:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                  <span className="font-bold text-xl text-gov-blue-900 dark:text-white">JanVoice AI</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-gov-blue-600 text-white shadow-lg shadow-gov-blue-200'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-medium">{t.logout}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Navbar */}
        <header className="h-16 glass sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:block hidden transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden block transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="relative group md:block hidden">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-gov-blue-600 transition-all"
              />
              <X className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
            
            {/* Multilingual Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => changeLanguage('English')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'English' ? 'bg-white dark:bg-slate-700 shadow-sm text-gov-blue-600' : 'text-slate-500'}`}
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('Kannada')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'Kannada' ? 'bg-white dark:bg-slate-700 shadow-sm text-gov-blue-600' : 'text-slate-500'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsNotificationsOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold">{t.notifications}</h3>
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-gov-blue-600 font-bold hover:underline"
                        >
                          {t.markAllRead}
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.read ? 'bg-gov-blue-50/50 dark:bg-gov-blue-900/10' : ''}`}
                          >
                            <div className="flex justify-between mb-1">
                              <h4 className="text-sm font-bold">{n.title}</h4>
                              {!n.read && <div className="w-2 h-2 bg-gov-blue-600 rounded-full" />}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full p-3 text-center text-xs font-bold text-gov-blue-600 border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {t.viewAll}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.fullName || 'Citizen'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-gov-blue-600 transition-all"
              >
                <User size={20} />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
