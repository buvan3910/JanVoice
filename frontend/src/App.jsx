import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RaiseComplaint from './pages/RaiseComplaint';
import Departments from './pages/Departments';
import ComplaintHistory from './pages/ComplaintHistory';
import Settings from './pages/Settings';
import MainLayout from './layouts/MainLayout';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AppContent({ isAuthenticated, setIsAuthenticated, theme, toggleTheme, language, changeLanguage }) {
  const location = useLocation();

  const ProtectedRoute = ({ children }) => {
    // Double-check localStorage directly to handle HMR edge cases
    const hasUser = localStorage.getItem('user');
    if (!isAuthenticated && !hasUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage language={language} /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login setIsAuthenticated={setIsAuthenticated} language={language} /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup setIsAuthenticated={setIsAuthenticated} language={language} /></PageTransition>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              toggleTheme={toggleTheme}
              language={language}
              changeLanguage={changeLanguage}
            >
              <PageTransition><Dashboard language={language} /></PageTransition>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/raise-complaint" element={
          <ProtectedRoute>
            <MainLayout 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              toggleTheme={toggleTheme}
              language={language}
              changeLanguage={changeLanguage}
            >
              <PageTransition><RaiseComplaint language={language} /></PageTransition>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/departments" element={
          <ProtectedRoute>
            <MainLayout 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              toggleTheme={toggleTheme}
              language={language}
              changeLanguage={changeLanguage}
            >
              <PageTransition><Departments language={language} /></PageTransition>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <MainLayout 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              toggleTheme={toggleTheme}
              language={language}
              changeLanguage={changeLanguage}
            >
              <PageTransition><ComplaintHistory language={language} /></PageTransition>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              toggleTheme={toggleTheme}
              language={language}
              changeLanguage={changeLanguage}
            >
              <PageTransition><Settings 
                theme={theme} 
                toggleTheme={toggleTheme}
                language={language}
                changeLanguage={changeLanguage}
              /></PageTransition>
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Initialize from localStorage immediately to prevent flash of unauthenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('user');
    return !!user;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'English');

  useEffect(() => {
    // Re-check auth state on mount and storage events
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };
    
    // Listen for storage changes (e.g., from other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Re-check auth when tab becomes visible (handles HMR edge cases)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initialize Citizen Score if not exists
    if (!localStorage.getItem('citizenScore')) {
      localStorage.setItem('citizenScore', '750');
    }
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        changeLanguage={changeLanguage}
      />
    </Router>
  );
}

export default App;
