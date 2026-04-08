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
    if (!isAuthenticated) {
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
  // Force rebuild comment
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
    
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
