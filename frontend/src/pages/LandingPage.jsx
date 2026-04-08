import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Zap, 
  MessageSquare, 
  MapPin, 
  CheckCircle2,
  Users,
  Sparkles,
  Bot,
  Send,
  Building2,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Star,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const translations = {
  English: {
    features: "Features",
    howItWorks: "How it Works",
    stats: "Stats",
    login: "Login",
    register: "Register Now",
    heroBadge: "TRANSFORMING GOVERNANCE WITH AI",
    heroTitle1: "Your Voice.",
    heroTitle2: "Karnataka’s Action.",
    heroDesc: "The first AI-powered public grievance platform for Karnataka citizens. Report issues via voice, track in real-time, and experience digital accountability.",
    ctaRegister: "Register Complaint",
    ctaExplore: "Explore Departments",
    statsLabel1: "Active Citizens",
    statsLabel2: "Resolved Issues",
    statsLabel3: "Depts. Connected",
    statsLabel4: "Resolution Time",
    featuresTitle: "Built for the Future",
    featuresSubtitle: "Cutting-edge features to ensure every grievance is handled with precision and speed.",
    howItWorksTitle: "Simplified Process,",
    howItWorksTitleSpan: "Powerful Impact.",
    howItWorksDesc: "We've removed the bureaucracy from grievance reporting. Follow these four simple steps to get your voice heard.",
    ctaReadyTitle: "Ready to make a change?",
    ctaReadyDesc: "Join thousands of citizens who are already helping build a better Karnataka.",
    ctaGetStarted: "Get Started Now",
    footerDesc: "Empowering the citizens of Karnataka through digital innovation and transparent governance.",
    footerPlatform: "Platform",
    footerSupport: "Support",
    footerCopyright: "© 2026 JanVoice AI. Digital Karnataka Initiative.",
    feature1Title: "AI-Powered Assistance",
    feature1Desc: "Our smart AI helps you refine your complaints, suggests the right department, and ensures your voice is heard clearly.",
    feature2Title: "Real-time Tracking",
    feature2Desc: "Stay updated with every step of your complaint process. Get instant notifications as your grievance is processed.",
    feature3Title: "Departmental Direct Routing",
    feature3Desc: "Directly connect with 18+ Karnataka government departments including BBMP, BESCOM, Police, and more.",
    feature4Title: "Transparent & Accountable",
    feature4Desc: "Every action is logged and visible. We ensure government accountability through digital tracking and reporting.",
    step1Title: "Describe Issue",
    step1Desc: "Describe your grievance in simple words, in English or Kannada, or use your voice.",
    step2Title: "AI Refinement",
    step2Desc: "Our AI assistant formats your complaint and suggests the right department automatically.",
    step3Title: "Direct Submission",
    step3Desc: "The complaint is instantly routed to the relevant Karnataka government official.",
    step4Title: "Track Action",
    step4Desc: "Monitor the progress in real-time and get notified when your issue is resolved."
  },
  Kannada: {
    features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    stats: "ಅಂಕಿಅಂಶಗಳು",
    login: "ಲಾಗಿನ್",
    register: "ಈಗಲೇ ನೋಂದಾಯಿಸಿ",
    heroBadge: "AI ಮೂಲಕ ಆಡಳಿತದ ರೂಪಾಂತರ",
    heroTitle1: "ನಿಮ್ಮ ಧ್ವನಿ.",
    heroTitle2: "ಕರ್ನಾಟಕದ ಕ್ರಮ.",
    heroDesc: "ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ ಮೊದಲ AI-ಚಾಲಿತ ಸಾರ್ವಜನಿಕ ದೂರು ವೇದಿಕೆ. ಧ್ವನಿಯ ಮೂಲಕ ದೂರು ನೀಡಿ, ನೈಜ ಸಮಯದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಹೊಣೆಗಾರಿಕೆಯನ್ನು ಅನುಭವಿಸಿ.",
    ctaRegister: "ದೂರು ನೋಂದಾಯಿಸಿ",
    ctaExplore: "ಇಲಾಖೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    statsLabel1: "ಸಕ್ರಿಯ ನಾಗರಿಕರು",
    statsLabel2: "ಪರಿಹರಿಸಲಾದ ಸಮಸ್ಯೆಗಳು",
    statsLabel3: "ಸಂಪರ್ಕಿತ ಇಲಾಖೆಗಳು",
    statsLabel4: "ಪರಿಹಾರದ ಸಮಯ",
    featuresTitle: "ಭವಿಷ್ಯಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
    featuresSubtitle: "ಪ್ರತಿ ದೂರನ್ನು ನಿಖರತೆ ಮತ್ತು ವೇಗದೊಂದಿಗೆ ನಿರ್ವಹಿಸುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಅತ್ಯಾಧುನಿಕ ವೈಶಿಷ್ಟ್ಯಗಳು.",
    howItWorksTitle: "ಸರಳೀಕೃತ ಪ್ರಕ್ರಿಯೆ,",
    howItWorksTitleSpan: "ಶಕ್ತಿಯುತ ಪರಿಣಾಮ.",
    howItWorksDesc: "ನಾವು ದೂರು ವರದಿ ಮಾಡುವಿಕೆಯಿಂದ ಕೆಂಪು ಪಟ್ಟಿಯನ್ನು ತೆಗೆದುಹಾಕಿದ್ದೇವೆ. ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಕೇಳಿಸಲು ಈ ನಾಲ್ಕು ಸರಳ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ.",
    ctaReadyTitle: "ಬದಲಾವಣೆ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    ctaReadyDesc: "ಉತ್ತಮ ಕರ್ನಾಟಕವನ್ನು ನಿರ್ಮಿಸಲು ಈಗಾಗಲೇ ಸಹಾಯ ಮಾಡುತ್ತಿರುವ ಸಾವಿರಾರು ನಾಗರಿಕರೊಂದಿಗೆ ಸೇರಿ.",
    ctaGetStarted: "ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ",
    footerDesc: "ಡಿಜಿಟಲ್ ನಾವೀನ್ಯತೆ ಮತ್ತು ಪಾರದರ್ಶಕ ಆಡಳಿತದ ಮೂಲಕ ಕರ್ನಾಟಕದ ನಾಗರಿಕರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು.",
    footerPlatform: "ವೇದಿಕೆ",
    footerSupport: "ಬೆಂಬಲ",
    footerCopyright: "© 2026 JanVoice AI. ಡಿಜಿಟಲ್ ಕರ್ನಾಟಕ ಉಪಕ್ರಮ.",
    feature1Title: "AI-ಚಾಲಿತ ನೆರವು",
    feature1Desc: "ನಮ್ಮ ಸ್ಮಾರ್ಟ್ AI ನಿಮ್ಮ ದೂರುಗಳನ್ನು ಪರಿಷ್ಕರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ, ಸರಿಯಾದ ಇಲಾಖೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
    feature2Title: "ನೈಜ-ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್",
    feature2Desc: "ನಿಮ್ಮ ದೂರು ಪ್ರಕ್ರಿಯೆಯ ಪ್ರತಿ ಹಂತದೊಂದಿಗೆ ನವೀಕೃತವಾಗಿರಿ. ನಿಮ್ಮ ದೂರನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿದಂತೆ ತ್ವರಿತ ಅಧಿಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    feature3Title: "ಇಲಾಖಾವಾರು ನೇರ ರೂಟಿಂಗ್",
    feature3Desc: "BBMP, BESCOM, ಪೊಲೀಸ್ ಮತ್ತು ಹೆಚ್ಚಿನವುಗಳನ್ನು ಒಳಗೊಂಡಂತೆ 18+ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.",
    feature4Title: "ಪಾರದರ್ಶಕ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ",
    feature4Desc: "ಪ್ರತಿ ಕ್ರಮವನ್ನು ದಾಖಲಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಗೋಚರಿಸುತ್ತದೆ. ಡಿಜಿಟಲ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ವರದಿ ಮಾಡುವಿಕೆಯ ಮೂಲಕ ನಾವು ಸರ್ಕಾರದ ಹೊಣೆಗಾರಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತೇವೆ.",
    step1Title: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
    step1Desc: "ನಿಮ್ಮ ದೂರನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಬಳಸಿ.",
    step2Title: "AI ಪರಿಷ್ಕರಣೆ",
    step2Desc: "ನಮ್ಮ AI ಸಹಾಯಕ ನಿಮ್ಮ ದೂರನ್ನು ಫಾರ್ಮ್ಯಾಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸರಿಯಾದ ಇಲಾಖೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
    step3Title: "ನೇರ ಸಲ್ಲಿಕೆ",
    step3Desc: "ದೂರನ್ನು ತಕ್ಷಣವೇ ಸಂಬಂಧಿತ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಗೆ ರವಾನಿಸಲಾಗುತ್ತದೆ.",
    step4Title: "ಕ್ರಮವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    step4Desc: "ನೈಜ ಸಮಯದಲ್ಲಿ ಪ್ರಗತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಸಮಸ್ಯೆ ಪರಿಹಾರವಾದಾಗ ಅಧಿಸೂಚನೆ ಪಡೆಯಿರಿ."
  }
};

const LandingPage = ({ language }) => {
  const t = translations[language || 'English'];
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const features = [
    {
      title: t.feature1Title,
      description: t.feature1Desc,
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: t.feature2Title,
      description: t.feature2Desc,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: t.feature3Title,
      description: t.feature3Desc,
      icon: Zap,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: t.feature4Title,
      description: t.feature4Desc,
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  const steps = [
    {
      number: "01",
      title: t.step1Title,
      description: t.step1Desc,
      icon: MessageSquare
    },
    {
      number: "02",
      title: t.step2Title,
      description: t.step2Desc,
      icon: Bot
    },
    {
      number: "03",
      title: t.step3Title,
      description: t.step3Desc,
      icon: Send
    },
    {
      number: "04",
      title: t.step4Title,
      description: t.step4Desc,
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-gov-blue-100 selection:text-gov-blue-900 transition-colors duration-500">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
              <span className="font-bold text-xl tracking-tight text-gov-blue-900 dark:text-white">JanVoice AI</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-gov-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">{t.features}</a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-gov-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">{t.howItWorks}</a>
              <a href="#stats" className="text-sm font-semibold text-slate-600 hover:text-gov-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">{t.stats}</a>
              
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-gov-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">{t.login}</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-gov-blue-200 dark:shadow-none hover:scale-105 active:scale-95">
                {t.register}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <motion.div 
          style={{ scale, opacity }}
          className="max-w-7xl mx-auto text-center relative"
        >
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full opacity-30 blur-3xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gov-blue-400 rounded-full mix-blend-multiply animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gov-saffron/30 rounded-full mix-blend-multiply animate-pulse delay-700"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gov-blue-50 dark:bg-gov-blue-900/30 text-gov-blue-600 dark:text-gov-blue-400 text-xs font-bold mb-8 border border-gov-blue-100 dark:border-gov-blue-800 shadow-sm"
            >
              <Sparkles size={14} className="animate-pulse" />
              {t.heroBadge}
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
              {t.heroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gov-blue-600 to-blue-400">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup" className="group px-10 py-5 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-gov-blue-200 dark:shadow-none flex items-center gap-3 hover:scale-105 active:scale-95">
                {t.ctaRegister}
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/departments" className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
                {t.ctaExplore}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 glass rounded-[3rem] p-10 border-slate-200/50 dark:border-slate-800/50">
            {[
              { label: t.statsLabel1, value: "50K+" },
              { label: t.statsLabel2, value: "12K+" },
              { label: t.statsLabel3, value: "18+" },
              { label: t.statsLabel4, value: "4.2d" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-black text-gov-blue-600 mb-2">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">{t.featuresTitle}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">{t.featuresSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-2xl hover:shadow-gov-blue-100 dark:hover:shadow-none transition-all group"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-4 bg-slate-100/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">{t.howItWorksTitle} <br /><span className="text-gov-blue-600">{t.howItWorksTitleSpan}</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 font-medium">{t.howItWorksDesc}</p>
              
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-gov-blue-600 font-black">
                      <step.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass rounded-[3rem] p-8 relative z-10 aspect-square flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gov-blue-600/10 to-transparent"></div>
                <div className="grid grid-cols-2 gap-4 relative z-20">
                  {steps.map((step, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: i * 0.5 
                      }}
                      className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center text-center"
                    >
                      <div className="w-10 h-10 bg-gov-blue-50 dark:bg-gov-blue-900/30 text-gov-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <step.icon size={20} />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{step.number}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-gov-blue-600/10 rounded-full animate-ping"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gov-blue-600/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto glass rounded-[4rem] p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gov-blue-600 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700"></div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8">{t.ctaReadyTitle}</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium">{t.ctaReadyDesc}</p>
          <Link to="/signup" className="inline-flex items-center gap-3 px-12 py-6 bg-gov-blue-600 hover:bg-gov-blue-700 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-gov-blue-200 dark:shadow-none hover:scale-105 active:scale-95">
            {t.ctaGetStarted}
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gov-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                <span className="font-bold text-xl tracking-tight text-gov-blue-900 dark:text-white">JanVoice AI</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t.footerDesc}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">{t.footerPlatform}</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><a href="#how-it-works" className="hover:text-gov-blue-600 transition-colors">{t.howItWorks}</a></li>
                  <li><Link to="/departments" className="hover:text-gov-blue-600 transition-colors">{t.ctaExplore}</Link></li>
                  <li><Link to="/raise-complaint" className="hover:text-gov-blue-600 transition-colors">JanVoice AI</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">{t.footerSupport}</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><a href="#" className="hover:text-gov-blue-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-gov-blue-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-gov-blue-600 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.footerCopyright}</p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <a key={social} href="#" className="text-slate-400 hover:text-gov-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
