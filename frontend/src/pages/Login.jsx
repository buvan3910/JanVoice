import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

const translations = {
  English: {
    welcome: "Welcome Back",
    subtitle: "Sign in to track your grievances",
    email: "Email Address",
    password: "Password",
    forgot: "Forgot?",
    signIn: "Sign In",
    orContinue: "OR CONTINUE WITH",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",
    errorEmpty: "Please fill in all fields",
    errorInvalid: "Invalid email or password. Use citizen@karnataka.gov.in / password123"
  },
  Kannada: {
    welcome: "ಮರಳಿ ಸುಸ್ವಾಗತ",
    subtitle: "ನಿಮ್ಮ ದೂರುಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    forgot: "ಮರೆತಿರುವಿರಾ?",
    signIn: "ಸೈನ್ ಇನ್",
    orContinue: "ಅಥವಾ ಇದರೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    createAccount: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    errorEmpty: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
    errorInvalid: "ತಪ್ಪು ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. citizen@karnataka.gov.in / password123 ಬಳಸಿ"
  }
};

const Login = ({ setIsAuthenticated, language }) => {
  const t = translations[language || 'English'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    if (email && password) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else if (email === 'citizen@karnataka.gov.in' && password === 'password123') {
        // Default mock user
        const defaultUser = {
          fullName: 'Kiran Kumar',
          email: 'citizen@karnataka.gov.in',
          password: 'password123'
        };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(t.errorInvalid);
      }
    } else {
      setError(t.errorEmpty);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="font-bold text-xl tracking-tight text-gov-blue-900 dark:text-white">JanVoice AI</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.welcome}</h1>
            <p className="text-slate-500">{t.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.email}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gov-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@karnataka.gov.in"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gov-blue-600 focus:border-transparent transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.password}</label>
                <a href="#" className="text-xs font-semibold text-gov-blue-600 hover:underline">{t.forgot}</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gov-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gov-blue-600 focus:border-transparent transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-gov-blue-200 dark:shadow-none flex items-center justify-center gap-2 group ripple"
            >
              {t.signIn}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.orContinue}</span>
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">
              <Chrome size={18} className="text-red-500" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">
              <Github size={18} />
              GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-slate-600 dark:text-slate-400 font-medium">
            {t.noAccount}{' '}
            <Link to="/signup" className="text-gov-blue-600 hover:underline">{t.createAccount}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
