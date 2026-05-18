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
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar as ReRadar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { INITIAL_SYLLABUS, MOCK_QUESTIONS } from './constants';
import { Subject, Question, QuizResult, StrengthData } from './types';

// --- Types ---
type Screen = 'login' | 'dashboard' | 'syllabus' | 'quiz' | 'strength' | 'tutor';

interface AppState {
  user: string | null;
  syllabus: Subject[];
  results: QuizResult[];
}

// --- Utils ---
const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return defaultValue;
};

// --- Main App ---
export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<string | null>(() => getLocalStorage('user', null));
  const [syllabus, setSyllabus] = useState<Subject[]>(() => getLocalStorage('syllabus', INITIAL_SYLLABUS));
  const [results, setResults] = useState<QuizResult[]>(() => getLocalStorage('quiz_results', []));

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('syllabus', JSON.stringify(syllabus));
    localStorage.setItem('quiz_results', JSON.stringify(results));
  }, [user, syllabus, results]);

  useEffect(() => {
    if (user && screen === 'login') {
      setScreen('dashboard');
    }
  }, [user]);

  const handleLogin = (name: string) => {
    setUser(name);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  const toggleChapter = (subjectId: string, chapterId: string) => {
    setSyllabus(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => c.id === chapterId ? { ...c, completed: !c.completed } : c)
        };
      }
      return s;
    }));
  };

  const addQuizResult = (result: QuizResult) => {
    setResults(prev => [...prev, result]);
  };

  // --- Render logic ---
  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
        {screen === 'dashboard' && (
          <DashboardScreen 
            user={user!} 
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
          <AITutorScreen onBack={() => setScreen('dashboard')} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Screens ---

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50"
    >
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
        <Target className="text-white w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Akshara-Deepa</h1>
      <p className="label-tiny mb-8">AI Assisted Learning</p>
      
      <div className="w-full space-y-3">
        <input 
          type="text" 
          placeholder="Enter Student Name"
          className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button 
          onClick={() => name && onLogin(name)}
          className="btn-primary w-full py-3.5 text-sm"
        >
          Begin Learning Session
        </button>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ user, syllabus, onNavigate, onLogout }: any) {
  const completionPercentage = Math.round(
    (syllabus.flatMap((s: any) => s.chapters).filter((c: any) => c.completed).length / 
    syllabus.flatMap((s: any) => s.chapters).length) * 100
  );

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-indigo-900 tracking-tight leading-none">Akshara-Deepa</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest leading-none mt-0.5">Tutor</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold leading-none">{user}</div>
            <div className="text-[10px] font-medium text-emerald-600 leading-none mt-0.5">Class 10th</div>
          </div>
          <button onClick={onLogout} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Progress Section */}
        <section className="card-high-density p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold">Course Completion</h2>
            <span className="text-xs font-bold text-indigo-600">{completionPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full bg-indigo-500"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {syllabus.map((s: any) => {
              const subComp = Math.round((s.chapters.filter((c: any) => c.completed).length / s.chapters.length) * 100);
              return (
                <div key={s.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">{s.name}</p>
                  <p className="text-xs font-bold">{subComp}%</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Goal */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Target size={18} />
          </div>
          <div>
            <p className="label-tiny text-amber-800 mb-0.5">Daily Goal</p>
            <p className="text-xs text-amber-700 font-medium">Complete at least one chapter today.</p>
          </div>
          <div className="ml-auto">
            <div className="w-8 h-8 rounded-full border-2 border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-600">
              0/1
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-4">
          <NavButton 
            icon={<BookOpen size={18} className="text-indigo-600" />} 
            label="Syllabus" 
            sub="Checklist"
            onClick={() => onNavigate('syllabus')}
          />
          <NavButton 
            icon={<PenTool size={18} className="text-emerald-600" />} 
            label="Quiz Mode" 
            sub="Quick Test"
            onClick={() => onNavigate('quiz')}
          />
          <NavButton 
            icon={<Radar size={18} className="text-orange-600" />} 
            label="Strength" 
            sub="Gap Map"
            onClick={() => onNavigate('strength')}
          />
          <NavButton 
            icon={<MessageSquare size={18} className="text-purple-600" />} 
            label="AI Tutor" 
            sub="Ask Gemini"
            onClick={() => onNavigate('tutor')}
          />
        </div>
      </div>
    </motion.div>
  );
}

function NavButton({ icon, label, sub, onClick }: any) {
  return (
    <button onClick={onClick} className="card-high-density p-4 flex items-center gap-3 text-left hover:border-indigo-300 group">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold leading-tight">{label}</h4>
        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </button>
  );
}

function SyllabusScreen({ syllabus, onToggle, onBack }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-slate-50"
    >
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-bold">Syllabus Tracker</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {syllabus.map((subject: any) => (
          <div key={subject.id} className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <h3 className="label-tiny text-slate-600">{subject.name}</h3>
              <span className="text-[10px] font-mono text-slate-400">
                {subject.chapters.filter((c: any) => c.completed).length}/{subject.chapters.length}
              </span>
            </div>
            <div className="grid gap-1.5">
              {subject.chapters.map((chapter: any) => (
                <button 
                  key={chapter.id} 
                  onClick={() => onToggle(subject.id, chapter.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                    chapter.completed 
                      ? 'bg-slate-100/50 border-slate-100 text-slate-400' 
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300'
                  }`}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center ${
                    chapter.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent'
                  }`}>
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="text-xs font-semibold flex-1 truncate">{chapter.title}</span>
                </button>
              ))}
            </div>
          </div>
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
  const questions = MOCK_QUESTIONS.slice(0, 5);

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
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (finalAnswers = answers) => {
    const score = questions.reduce((acc, q, idx) => {
      return acc + (q.correctAnswer === finalAnswers[idx] ? 1 : 0);
    }, 0);
    
    onFinish({
      id: Date.now().toString(),
      subject: questions[0].subject,
      score,
      total: questions.length,
      date: new Date().toISOString()
    });
    setStep('results');
  };

  if (step === 'intro') {
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center text-center bg-slate-50">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-100">
          <PenTool size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Knowledge Pulse</h2>
        <p className="text-xs text-slate-500 mb-8 max-w-[200px]">Test your mastery with 5 quick questions in 60 seconds.</p>
        <button onClick={() => setStep('active')} className="btn-primary w-full py-4 text-sm">
          Commence Test
        </button>
        <button onClick={onBack} className="mt-4 label-tiny hover:text-slate-900">Return to Dashboard</button>
      </div>
    );
  }

  if (step === 'results') {
    const score = questions.reduce((acc, q, idx) => acc + (q.correctAnswer === answers[idx] ? 1 : 0), 0);
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center text-center bg-slate-50">
        <div className="w-24 h-24 bg-amber-400 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-100">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Session Complete</h2>
        <p className="label-tiny mb-6">Quiz Assessment</p>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-8 w-full shadow-sm">
          <div className="text-4xl font-black text-indigo-600">{score}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Correct Answers</div>
        </div>
        <button onClick={onBack} className="btn-primary w-full py-4 text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-bold font-mono bg-slate-100 px-2 py-1 rounded">PART {currentIdx + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <Clock size={12} className={timer < 10 ? 'text-rose-500' : 'text-slate-400'} />
          <span className={timer < 10 ? 'text-rose-500' : 'text-slate-600'}>{timer}s</span>
        </div>
      </header>

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-8">
          <p className="label-tiny text-indigo-600 mb-2">{currentQ.subject}</p>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{currentQ.questionText}</h3>
        </div>
        
        <div className="space-y-2 mt-auto">
          {Object.entries(currentQ.options).map(([key, value]) => (
            <button 
              key={key} 
              onClick={() => handleAnswer(key)}
              className="w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center gap-4 group"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center font-bold text-xs transition-colors">{key}</span>
              <span className="text-xs font-semibold text-slate-700">{value}</span>
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
      : 40; // Default min for visual
    return { ...base, value: strength };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-slate-50"
    >
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-bold">Performance Map</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="card-high-density p-4 flex flex-col items-center">
          <h3 className="label-tiny self-start mb-4">Skill Radar</h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="54%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <ReRadar
                  name="Strength"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="label-tiny text-slate-400 px-2">Detailed Analysis</h3>
          {chartData.map(d => (
            <div key={d.subject} className="card-high-density p-4 flex justify-between items-center border-slate-100">
               <span className="text-xs font-bold text-slate-700">{d.subject}</span>
               <div className="flex items-center gap-3">
                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${d.value}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-indigo-600 font-mono w-8 text-right">{d.value}%</span>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
            <p className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Top Subject</p>
            <p className="text-sm font-black text-slate-800">Mathematics</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
            <p className="text-[9px] font-bold text-rose-600 uppercase mb-1">Improvement</p>
            <p className="text-sm font-black text-slate-800">Social Science</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AITutorScreen({ onBack }: any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'model', parts: [{ text: "Hi Akshara! I see you're ready for some guided learning. Ask me any doubt in Science, Math, or Social Studies!" }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
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
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm having a bit of trouble connecting to my central brain. Try once more?" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-1 flex flex-col h-full bg-slate-900"
    >
      <header className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-white">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white">AI Tutor Panel</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-emerald-500">Gemini Active</span>
            </div>
          </div>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-slate-800 rounded-full font-mono text-slate-400">v1.2-flash</span>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <p className="whitespace-pre-wrap">{m.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700 flex gap-1">
              {[0, 0.2, 0.4].map((delay) => (
                <span key={delay} className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask a question..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="bg-indigo-600 w-10 h-10 rounded-lg text-white flex items-center justify-center disabled:opacity-30 shadow-lg shadow-indigo-900/40"
            disabled={!input.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
