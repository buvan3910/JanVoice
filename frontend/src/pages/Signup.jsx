import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';

const translations = {
  English: {
    title: "Create Account",
    subtitle: "Join 50,000+ citizens making a difference",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    confirm: "Confirm",
    signUp: "Sign Up",
    orContinue: "OR CONTINUE WITH",
    alreadyAccount: "Already have an account?",
    signIn: "Sign In",
    errorMismatch: "Passwords do not match",
    errorEmpty: "Please fill in all fields"
  },
  Kannada: {
    title: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    subtitle: "ಬದಲಾವಣೆ ಮಾಡುತ್ತಿರುವ 50,000+ ನಾಗರಿಕರೊಂದಿಗೆ ಸೇರಿ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirm: "ದೃಢೀಕರಿಸಿ",
    signUp: "ಸೈನ್ ಅಪ್",
    orContinue: "ಅಥವಾ ಇದರೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    alreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    signIn: "ಸೈನ್ ಇನ್",
    errorMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
    errorEmpty: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ"
  }
};

const Signup = ({ setIsAuthenticated, language }) => {
  const t = translations[language || 'English'];
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.errorMismatch);
      return;
    }

    if (fullName && email && password) {
      const newUser = { fullName, email, password };
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsAuthenticated(true);
      navigate('/dashboard');
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
        className="w-full max-w-md mt-16 mb-8"
      >
        <div className="glass p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-slate-500">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.fullName}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gov-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Kiran Kumar"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gov-blue-600 focus:border-transparent transition-all dark:text-white"
                  required
                />
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.password}</label>
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.confirm}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gov-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gov-blue-600 focus:border-transparent transition-all dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-gov-blue-200 dark:shadow-none flex items-center justify-center gap-2 group ripple"
            >
              {t.signUp}
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
            {t.alreadyAccount}{' '}
            <Link to="/login" className="text-gov-blue-600 hover:underline">{t.signIn}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
