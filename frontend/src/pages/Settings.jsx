import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Lock,
  ChevronRight,
  Camera,
  LogOut,
  Save,
  Languages,
  Eye,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Settings = ({ theme, toggleTheme, language, changeLanguage }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your digital identity and preferences.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Sidebar Navigation */}
        <div className="space-y-3">
          {[
            { name: 'Profile Information', icon: User, active: true },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Privacy & Security', icon: Shield, active: false },
            { name: 'Language & Region', icon: Globe, active: false },
            { name: 'Appearance', icon: Moon, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
                item.active 
                ? 'bg-gov-blue-600 text-white shadow-xl shadow-gov-blue-100 dark:shadow-none' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} />
                {item.name}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-10">
          {/* Profile Card */}
          <div className="glass p-10 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <SettingsIcon size={160} />
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-gov-blue-600 border-8 border-white dark:border-slate-900 shadow-2xl overflow-hidden">
                    <User size={56} />
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-3 bg-gov-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{user?.fullName || 'Citizen Name'}</h3>
                  <p className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-[10px]">{user?.email || 'citizen@karnataka.gov.in'}</p>
                  <span className="px-4 py-1.5 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-green-200 dark:border-green-800">
                    Verified Citizen
                  </span>
                </div>
              </div>

              <form className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Smartphone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98XXX XXXXX"
                      className="w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="px-10 py-4 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-gov-blue-100 dark:shadow-none flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[3rem] space-y-8">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <Bell size={20} className="text-gov-blue-600" />
                Alerts
              </h4>
              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 capitalize">{key}</span>
                    <button 
                      onClick={() => handleToggleNotification(key)}
                      className={`w-14 h-7 rounded-full transition-all relative ${value ? 'bg-gov-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        animate={{ x: value ? 28 : 4 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] space-y-8">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <Globe size={20} className="text-gov-blue-600" />
                Language
              </h4>
              <div className="space-y-4">
                {['English', 'Kannada'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border ${
                      language === lang 
                      ? 'bg-gov-blue-50 dark:bg-gov-blue-900/20 text-gov-blue-600 border-gov-blue-100 dark:border-gov-blue-800' 
                      : 'text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {lang}
                    {language === lang && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[3rem] space-y-8">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} className="text-gov-blue-600" /> : <Sun size={20} className="text-gov-blue-600" />}
              Appearance
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Dark Mode</span>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full transition-all relative ${theme === 'dark' ? 'bg-gov-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <motion.div 
                  animate={{ x: theme === 'dark' ? 28 : 4 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-10 border-4 border-dashed border-red-100 dark:border-red-900/30 rounded-[3rem] bg-red-50/30 dark:bg-red-950/10 space-y-6">
            <div className="flex items-center gap-4 text-red-600">
              <AlertCircle size={24} />
              <h4 className="text-lg font-black uppercase tracking-widest">Danger Zone</h4>
            </div>
            <p className="text-sm text-red-500 font-bold leading-relaxed">
              Once you delete your account, all your complaint history and Citizen Score will be permanently removed.
            </p>
            <button className="px-8 py-3 bg-red-100 dark:bg-red-950/30 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900">
              Delete My Digital ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
