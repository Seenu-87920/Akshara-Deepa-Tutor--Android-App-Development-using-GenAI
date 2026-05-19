import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  LayoutDashboard, 
  MessageSquare, 
  PenTool, 
  Radar, 
  Trophy,
  ArrowLeft,
  Clock,
  Send,
  User,
  LogOut,
  Target,
  Flame,
  Zap,
  Star,
  Award,
  Mic,
  Calendar,
  Layers,
  ArrowUpRight,
  Mail,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar as ReRadar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { INITIAL_SYLLABUS, MOCK_QUESTIONS, MOCK_LEADERBOARD, INITIAL_BADGES } from './constants';
import { Subject, Question, QuizResult, StrengthData, UserStats, Badge, LeaderboardEntry } from './types';

// --- Types ---
type Screen = 'login' | 'dashboard' | 'syllabus' | 'quiz' | 'strength' | 'tutor' | 'leaderboard';

// --- Main App ---
export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<string | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('user_stats');
    if (saved) return JSON.parse(saved);
    return {
      xp: 0,
      level: 1,
      streak: 1,
      lastActive: new Date().toISOString(),
      badges: INITIAL_BADGES
    };
  });

  const [syllabus, setSyllabus] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('syllabus');
    return saved ? JSON.parse(saved) : INITIAL_SYLLABUS;
  });

  const [results, setResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('quiz_results');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user_stats', JSON.stringify(stats));
    localStorage.setItem('syllabus', JSON.stringify(syllabus));
    localStorage.setItem('quiz_results', JSON.stringify(results));
  }, [user, stats, syllabus, results]);

  useEffect(() => {
    if (user && screen === 'login') {
      setScreen('dashboard');
    }
  }, [user]);

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const handleLogin = (name: string) => {
    setUser(name);
    setScreen('dashboard');
    addXP(100); // Join bonus
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  const toggleChapter = (subjectId: string, chapterId: string) => {
    let completed = false;
    setSyllabus(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => {
            if (c.id === chapterId) {
              completed = !c.completed;
              return { ...c, completed };
            }
            return c;
          })
        };
      }
      return s;
    }));
    
    if (completed) {
      addXP(50);
    }
  };

  const addQuizResult = (result: QuizResult) => {
    setResults(prev => [...prev, result]);
    addXP(result.score * 40);
    
    if (result.score === 5) {
      setStats(prev => ({
        ...prev,
        badges: prev.badges.map(b => b.id === 'b2' ? { ...b, unlocked: true } : b)
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden flex flex-col bg-slate-50 font-sans shadow-2xl">
      <AnimatePresence mode="wait">
        {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
        
        {screen === 'dashboard' && (
          <DashboardScreen 
            user={user!} 
            stats={stats}
            syllabus={syllabus} 
            onNavigate={setScreen} 
            onLogout={handleLogout} 
          />
        )}
        
        {screen === 'syllabus' && (
          <SyllabusScreen 
            syllabus={syllabus} 
            onToggle={toggleChapter} 
            onBack={() => setScreen('dashboard')} 
          />
        )}
        
        {screen === 'quiz' && (
          <QuizScreen 
            onFinish={addQuizResult} 
            onBack={() => setScreen('dashboard')} 
          />
        )}
        
        {screen === 'strength' && (
          <StrengthMapScreen 
            results={results} 
            onBack={() => setScreen('dashboard')} 
          />
        )}
        
        {screen === 'tutor' && (
          <AITutorScreen user={user!} onBack={() => setScreen('dashboard')} />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen 
            user={user!} 
            xp={stats.xp} 
            onBack={() => setScreen('dashboard')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Specific Screen Components ---

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMode('login');
      }, 3000);
      return;
    }
    
    // For trial, we just use the name
    const displayName = mode === 'signup' ? name : (email.split('@')[0] || 'Student');
    onLogin(displayName);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden"
    >
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl -z-10" />

      <motion.div 
        layout
        className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-100 border-4 border-indigo-900/20"
      >
        <div className="relative">
          <Flame className="text-amber-400 w-10 h-10 fill-amber-400 animate-pulse" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-600/30 blur-sm rounded-full" />
        </div>
      </motion.div>
      
      <motion.div layout>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
          AKSHARA DEEPA Tutor
        </h1>
        <p className="text-slate-400 font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">
          {mode === 'login' ? 'Journey to Enlightenment' : mode === 'signup' ? 'Join the light of learning' : 'Verify your identity'}
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-xs">
        {mode === 'signup' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <User size={18} />
            </div>
            <input 
              type="text" 
              required
              placeholder="Full Name"
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm font-semibold text-slate-700 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </motion.div>
        )}

        <motion.div layout className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Mail size={18} />
          </div>
          <input 
            type="email" 
            required
            placeholder="Email Address"
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm font-semibold text-slate-700 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        {mode !== 'forgot' && (
          <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              required
              placeholder="Password"
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm font-semibold text-slate-700 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
        )}

        {isSuccess ? (
          <div className="py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold animate-bounce">
            Verification link sent to email!
          </div>
        ) : (
          <button 
            type="submit"
            className="btn-modern w-full py-4 text-sm uppercase tracking-widest mt-2"
          >
            {mode === 'login' ? 'Initialize' : mode === 'signup' ? 'Join Deepa' : 'Send Link'}
          </button>
        )}
      </form>

      <motion.div layout className="mt-8 space-y-4">
        {mode === 'login' ? (
          <>
            <button onClick={() => setMode('forgot')} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
              Forgot Access Credentials?
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">New Student?</span>
              <button 
                onClick={() => setMode('signup')}
                className="text-xs font-black text-indigo-600 hover:underline decoration-2 underline-offset-4"
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => setMode('login')}
            className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        )}
      </motion.div>

      <p className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.1 Secured Build</p>
    </motion.div>
  );
}

function DashboardScreen({ user, stats, syllabus, onNavigate, onLogout }: any) {
  const completionPercentage = Math.round(
    (syllabus.flatMap((s: any) => s.chapters).filter((c: any) => c.completed).length / 
    syllabus.flatMap((s: any) => s.chapters).length) * 100
  );

  return (
    <motion.div 
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      className="flex-1 flex flex-col bg-slate-50"
    >
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
            {user[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">{user}</h2>
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 bg-emerald-100 rounded-md">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Level {stats.level}</span>
              </div>
              <div className="px-2 py-0.5 bg-amber-100 rounded-md flex items-center gap-1">
                <Flame size={10} className="text-amber-600 fill-amber-600" />
                <span className="text-[10px] font-bold text-amber-700 uppercase">{stats.streak} Day Streak</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('leaderboard')} className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-colors">
            <Award size={20} />
          </button>
          <button onClick={onLogout} className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 custom-scrollbar">
        {/* XP Progress Bar */}
        <div className="card-premium p-5 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-4 -translate-y-4">
            <Star size={100} />
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="label-tiny text-indigo-300 mb-1">Current Progress</p>
              <h3 className="text-2xl font-black">{stats.xp} <span className="text-sm font-medium opacity-50">XP</span></h3>
            </div>
            <span className="text-[10px] font-bold bg-indigo-800 px-2 py-1 rounded-md uppercase tracking-wider">Level {stats.level} Scholar</span>
          </div>
          <div className="h-2 w-full bg-indigo-950 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xp % 1000) / 10}%` }}
              className="h-full bg-indigo-400"
            />
          </div>
          <p className="text-[9px] font-bold text-indigo-200 mt-3 uppercase tracking-widest">
            {1000 - (stats.xp % 1000)} XP to Level {stats.level + 1}
          </p>
        </div>

        {/* Dynamic Study Plan */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-indigo-600" />
              Daily Study Plan
            </h3>
            <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer">
              Refresh <ArrowUpRight size={10} />
            </span>
          </div>
          <div className="space-y-2">
            <PlanItem 
              icon={<Zap size={14} className="text-amber-500" />} 
              label="15m Quick Quiz" 
              sub="Boost your Science score"
              status="todo"
              onClick={() => onNavigate('quiz')}
            />
            <PlanItem 
              icon={<BookOpen size={14} className="text-indigo-500" />} 
              label="Metals and Non-metals" 
              sub="Complete subject chapter"
              status="todo"
              onClick={() => onNavigate('syllabus')}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            icon={<Layers className="text-indigo-600" />}
            title="Syllabus"
            desc={`${completionPercentage}% COMPLETED`}
            onClick={() => onNavigate('syllabus')}
            color="bg-indigo-50"
          />
          <DashboardCard 
            icon={<PenTool className="text-emerald-600" />}
            title="Mock Quiz"
            desc="EARN 400 XP"
            onClick={() => onNavigate('quiz')}
            color="bg-emerald-50"
          />
          <DashboardCard 
            icon={<Radar className="text-orange-600" />}
            title="Strength"
            desc="ANALYZE GAPS"
            onClick={() => onNavigate('strength')}
            color="bg-orange-50"
          />
          <DashboardCard 
            icon={<MessageSquare className="text-purple-600" />}
            title="AI Tutor"
            desc="VOICE ENABLED"
            onClick={() => onNavigate('tutor')}
            color="bg-purple-50"
          />
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Achievements</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {stats.badges.map((b: any) => (
              <div key={b.id} className={`flex-shrink-0 w-24 h-32 card-premium p-3 flex flex-col items-center text-center justify-center gap-2 ${!b.unlocked && 'grayscale opacity-50'}`}>
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-[10px] font-black leading-tight text-slate-800">{b.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Action Button for AI Voice */}
      <button 
        onClick={() => onNavigate('tutor')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-400 group ring-4 ring-indigo-50 active:scale-90 transition-all z-20"
      >
        <Mic className="text-white group-hover:scale-110 transition-transform" />
      </button>
    </motion.div>
  );
}

function PlanItem({ icon, label, sub, status, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full card-premium p-4 flex items-center justify-between border-slate-100 hover:border-indigo-200 group active:scale-[0.98]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="text-xs font-bold text-slate-800">{label}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
      </div>
      <div className="p-1 px-3 rounded-full bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-wider group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        {status}
      </div>
    </button>
  );
}

function DashboardCard({ icon, title, desc, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`card-premium p-5 flex flex-col gap-4 text-left border-transparent hover:border-indigo-100 group transition-all`}>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-800">{title}</h4>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{desc}</p>
      </div>
    </button>
  );
}

function SyllabusScreen({ syllabus, onToggle, onBack }: any) {
  const [activeTab, setActiveTab] = useState(syllabus[0].id);

  return (
    <motion.div 
      initial={{ x: 200 }}
      animate={{ x: 0 }}
      exit={{ x: 200 }}
      className="flex-1 flex flex-col bg-slate-50"
    >
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">Study Roadmap</h2>
          <span className="label-tiny">SSLC Curriculum 2026</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-4 bg-white border-b border-slate-50 shrink-0">
        {syllabus.map((s: any) => (
          <button 
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border ${
              activeTab === s.id 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {syllabus.find((s: any) => s.id === activeTab).chapters.map((chapter: any) => (
          <button 
            key={chapter.id}
            onClick={() => onToggle(activeTab, chapter.id)}
            className={`w-full card-premium p-4 flex items-center gap-4 text-left transition-all group ${
              chapter.completed 
                ? 'bg-emerald-50/50 border-emerald-100 text-slate-400' 
                : 'bg-white hover:border-indigo-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              chapter.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
            }`}>
              <CheckCircle2 size={chapter.completed ? 16 : 18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className={`text-xs font-bold truncate ${chapter.completed ? 'opacity-50' : 'text-slate-800'}`}>
                {chapter.title}
              </h4>
              <p className="text-[9px] uppercase font-black text-slate-400 mt-1">Foundational Concept</p>
            </div>
            {chapter.completed ? (
              <div className="px-2 py-1 bg-emerald-100 rounded-md text-[8px] font-black uppercase text-emerald-700 tracking-widest">
                +50 XP
              </div>
            ) : (
              <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function QuizScreen({ onFinish, onBack }: any) {
  const [step, setStep] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timer, setTimer] = useState(60);
  const [shuffledQuestions] = useState(() => [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5));

  useEffect(() => {
    let interval: any;
    if (step === 'active' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && step === 'active') {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (finalAnswers = answers) => {
    const score = shuffledQuestions.reduce((acc, q, idx) => {
      return acc + (q.correctAnswer === finalAnswers[idx] ? 1 : 0);
    }, 0);
    
    onFinish({
      id: Date.now().toString(),
      subject: shuffledQuestions[0].subject,
      score,
      total: shuffledQuestions.length,
      date: new Date().toISOString()
    });
    setStep('results');
  };

  if (step === 'intro') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[32px] flex items-center justify-center mb-8 animate-pulse shadow-xl shadow-rose-100">
          <Zap size={44} className="fill-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Knowledge Sprint</h2>
        <p className="text-xs text-slate-400 font-medium mb-12 max-w-[200px]">Rapid evaluation mode. 5 questions to test your limits. Earn up to 200 XP.</p>
        
        <div className="w-full space-y-3">
          <button onClick={() => setStep('active')} className="btn-modern w-full text-sm">
            Commence Mission
          </button>
          <button onClick={onBack} className="w-full py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">
            Abort Mission
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const score = shuffledQuestions.reduce((acc, q, idx) => acc + (q.correctAnswer === answers[idx] ? 1 : 0), 0);
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-10 text-center"
      >
        <div className="w-40 h-40 bg-amber-400 rounded-full flex items-center justify-center mb-8 relative shadow-2xl shadow-amber-100 border-8 border-white">
          <Trophy className="text-white" size={80} />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Star className="text-amber-400 fill-amber-400" size={32} />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2">Victory!</h2>
        <p className="label-tiny mb-8">Performance Score</p>
        
        <div className="w-full card-premium p-6 mb-10 flex justify-between items-center bg-slate-50 border-transparent shadow-inner">
          <div className="text-left">
             <p className="label-tiny text-slate-400">Total Correct</p>
             <h4 className="text-3xl font-black text-indigo-600">{score} / {shuffledQuestions.length}</h4>
          </div>
          <div className="text-right">
             <p className="label-tiny text-slate-400">XP Earned</p>
             <h4 className="text-xl font-black text-emerald-600">+{score * 40} XP</h4>
          </div>
        </div>

        <button onClick={onBack} className="btn-modern w-full">
          Sync and Continue
        </button>
      </motion.div>
    );
  }

  const currentQ = shuffledQuestions[currentIdx];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black font-mono bg-slate-900 text-white px-3 py-1.5 rounded-lg">SEGMENT {currentIdx + 1}/5</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-black">
          <Clock size={16} className={timer < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-300'} />
          <span className={`w-8 ${timer < 10 ? 'text-rose-600 font-black' : 'text-slate-600'}`}>0:{timer.toString().padStart(2, '0')}</span>
        </div>
      </header>
      
      {/* ProgressBar Top */}
      <div className="h-1.5 w-full bg-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIdx / 5) * 100}%` }}
          className="h-full bg-indigo-600"
        />
      </div>

      <div className="flex-1 p-8 flex flex-col">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <p className="label-tiny text-indigo-600">{currentQ.subject}</p>
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{currentQ.questionText}</h3>
        </div>
        
        <div className="space-y-3 mt-auto">
          {Object.entries(currentQ.options).map(([key, value]) => (
            <button 
              key={key} 
              onClick={() => handleAnswer(key)}
              className="w-full text-left p-5 rounded-[22px] bg-white border-2 border-slate-50 hover:border-indigo-600 hover:bg-indigo-50/20 transition-all flex items-center gap-5 group active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-indigo-50"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center font-black text-xs transition-all ring-1 ring-slate-100 border border-white">
                {key}
              </div>
              <span className="text-sm font-bold text-slate-700 leading-tight">{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrengthMapScreen({ results, onBack }: any) {
  const chartData = [
    { subject: 'Science', full: 100 },
    { subject: 'Math', full: 100 },
    { subject: 'Social', full: 100 },
  ].map(base => {
    const subResults = results.filter((r: any) => r.subject.toLowerCase() === base.subject.toLowerCase());
    const strength = subResults.length > 0 
      ? Math.round((subResults.reduce((acc: any, r: any) => acc + r.score, 0) / (subResults.length * 5)) * 100) 
      : 40;
    return { ...base, value: strength };
  });

  return (
    <motion.div 
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      className="flex-1 flex flex-col bg-slate-50"
    >
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold">Performance Analytics</h2>
          <span className="label-tiny">Intelligence Overview</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="card-premium p-6 flex flex-col items-center bg-white">
          <div className="flex justify-between w-full mb-6">
             <h3 className="label-tiny text-slate-600">Cognitive Radar</h3>
             <span className="px-2 py-0.5 bg-indigo-100 rounded-md text-[9px] font-black text-indigo-700 uppercase">Live Data</span>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <ReRadar
                  name="Strength"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.15}
                  strokeWidth={3}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="label-tiny text-slate-400 px-1 font-black">Subject Metrics</h3>
          <div className="grid gap-3">
            {chartData.map(d => (
              <div key={d.subject} className="card-premium p-5 flex justify-between items-center border-transparent shadow-sm">
                 <div>
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{d.subject}</h5>
                   <h6 className="text-lg font-black text-slate-800 leading-none">Mastery Level</h6>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <span className="text-xl font-black font-mono text-indigo-600">{d.value}%</span>
                   <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${d.value}%` }}
                        className="h-full bg-indigo-500" 
                      />
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-6 bg-slate-900 border-transparent relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
           <p className="label-tiny text-indigo-400 mb-2">Personalized Recommendation</p>
           <h4 className="text-white text-sm font-bold leading-relaxed mb-4">Focus on <span className="text-indigo-300">Social Science</span> to improve your percentile rank.</h4>
           <button onClick={onBack} className="text-xs font-black text-white bg-indigo-600 px-4 py-2.5 rounded-lg shadow-xl shadow-indigo-900/40">
             Open Learning Path
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function AITutorScreen({ user, onBack }: any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'model', parts: [{ text: `Welcome to the Guided Intelligence Hub, ${user}. I'm synced with your SSLC progress data. How can I assist your study mission today?` }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Communication blackout. Please try linking again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="flex-1 flex flex-col h-full bg-slate-900"
    >
      <header className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Deepa-AI v2.0</h2>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-glow" />
               <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Neural Link Open</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2.5 bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 transition-colors">
              <Star size={18} />
           </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.1),transparent_50%)]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[22px] text-xs font-medium leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xl shadow-indigo-900/20' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
            }`}>
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 font-bold text-[10px] text-indigo-400 animate-pulse tracking-widest uppercase">
              Processing Neuro-Signal...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800 relative z-10 shrink-0">
        {isListening && (
          <div className="absolute top-0 left-0 w-full transform -translate-y-full px-6 pb-4">
             <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-indigo-900 border border-indigo-500 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-1 bg-white rounded-full" />)}
                   </div>
                   <span className="text-xs font-bold text-white">Listening...</span>
                </div>
                <button onClick={() => setIsListening(false)} className="text-[10px] font-black uppercase text-indigo-200">Cancel</button>
             </div>
          </div>
        )}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Query the system..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
               onClick={() => setIsListening(true)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
            >
               <Mic size={18} />
            </button>
          </div>
          <button 
            onClick={sendMessage}
            className="bg-indigo-600 w-14 h-14 rounded-2xl text-white flex items-center justify-center disabled:opacity-30 shadow-2xl shadow-indigo-900 active:scale-90 transition-all shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send size={20} className="transform translate-x-0.5 -translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LeaderboardScreen({ user, xp, onBack }: any) {
  const currentLeaderboard = [...MOCK_LEADERBOARD, { rank: 6, name: user, xp, isCurrentUser: true }].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <motion.div 
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      exit={{ y: 300 }}
      className="flex-1 flex flex-col bg-indigo-600"
    >
      <header className="p-6 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors backdrop-blur-md">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black text-white uppercase tracking-widest">Global Ranking</h2>
        <div className="w-10" />
      </header>

      {/* Top 3 Podium */}
      <div className="px-6 flex items-end justify-center gap-4 h-48 pb-6 relative">
         <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-4 border-slate-300 overflow-hidden bg-slate-200">
               <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">2</div>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-t-xl group backdrop-blur-md flex flex-col items-center p-2">
               <span className="text-[10px] text-white font-bold">{currentLeaderboard[1]?.name.split(' ')[0]}</span>
            </div>
         </div>
         <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 overflow-hidden bg-white shadow-xl">
               <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-2xl">1</div>
            </div>
            <div className="h-24 w-20 bg-white/20 rounded-t-xl group backdrop-blur-md flex flex-col items-center p-2 relative">
               <Trophy className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-amber-300" size={20} />
               <span className="text-xs text-white font-black">{currentLeaderboard[0]?.name.split(' ')[0]}</span>
            </div>
         </div>
         <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-4 border-amber-600 overflow-hidden bg-amber-50">
               <div className="w-full h-full flex items-center justify-center text-amber-700 font-bold text-lg">3</div>
            </div>
            <div className="h-12 w-16 bg-white/10 rounded-t-xl group backdrop-blur-md flex flex-col items-center p-2">
               <span className="text-[10px] text-white font-bold">{currentLeaderboard[2]?.name.split(' ')[0]}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-slate-50 rounded-t-[40px] p-6 pt-10 space-y-3 overflow-y-auto custom-scrollbar shadow-inner-top">
        {currentLeaderboard.map((item) => (
          <div key={item.name} className={`card-premium p-4 flex items-center justify-between border-transparent hover:border-indigo-100 transition-all ${item.isCurrentUser ? 'bg-indigo-50/80 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white'}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                {item.rank}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${item.isCurrentUser ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {item.name} {item.isCurrentUser && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md ml-2">YOU</span>}
                </h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">SSLC SCHOLAR</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-600">
              <span className="text-sm font-black italic">{item.xp}</span>
              <span className="text-[10px] font-bold opacity-50">XP</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
