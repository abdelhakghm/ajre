
import React, { useState, useEffect, useMemo } from 'react';
import { Achievement, AppState, Gender, DailyLog } from './types';
import { CATEGORIES, ACHIEVEMENTS, PERIOD_START_DATE } from './constants';
import { calculatePoints, getTodayDateStr, getHijriDate, getDayOfPeriod } from './utils';
import Header from './components/Header';
import AchievementCard from './components/AchievementCard';
import DetailsModal from './components/DetailsModal';
import Onboarding from './components/Onboarding';
import BottomNav from './components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Settings, Trash2, ShieldCheck, Download, Calendar, Zap, ChevronRight, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'ajar_app_data';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user || { totalPoints: 0, activeDays: 0, gender: null, name: '' },
          logs: parsed.logs || {},
          history: parsed.history || []
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      user: { totalPoints: 0, activeDays: 0, gender: null, name: '' },
      logs: {},
      history: []
    };
  });

  const [activeTab, setActiveTab] = useState('home');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Track selected date for navigation (defaults to today)
  const [viewDateStr, setViewDateStr] = useState(getTodayDateStr());

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const today = useMemo(() => getTodayDateStr(), []);
  
  // Calculate day details for the header based on the current system time
  const hijriDateDisplay = useMemo(() => getHijriDate(new Date()), []);
  const dayOfPeriodDisplay = useMemo(() => getDayOfPeriod(new Date(), PERIOD_START_DATE), []);

  // Derived Data: History and Points
  const computedHistory = useMemo(() => {
    return Object.entries(state.logs)
      .map(([date, log]) => ({
        date,
        points: calculatePoints(log as DailyLog, state.user.gender)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [state.logs, state.user.gender]);

  const totalPoints = useMemo(() => {
    return computedHistory.reduce((sum, h) => sum + h.points, 0);
  }, [computedHistory]);

  const activeDays = useMemo(() => {
    return computedHistory.filter(h => h.points > 0).length;
  }, [computedHistory]);

  const viewLog = useMemo(() => state.logs[viewDateStr] || ({} as DailyLog), [state.logs, viewDateStr]);
  
  const viewDatePoints = useMemo(() => {
    return calculatePoints(viewLog, state.user.gender);
  }, [viewLog, state.user.gender]);

  const handleAchievementChange = (id: string, value: any) => {
    setState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [viewDateStr]: {
          ...prev.logs[viewDateStr] || {},
          [id]: value
        }
      }
    }));
  };

  const resetData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const chartData = useMemo(() => {
    return computedHistory.slice(-30).map(h => ({
      name: h.date.split('-').slice(1).join('/'),
      points: h.points
    }));
  }, [computedHistory]);

  const categoryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    CATEGORIES.forEach(c => stats[c.id] = 0);

    ACHIEVEMENTS.forEach(a => {
      const val = viewLog[a.id];
      if (val) {
        if (typeof val === 'number') stats[a.category] += val;
        else if (val === true) stats[a.category] += 1;
        else stats[a.category] += 2;
      }
    });

    return CATEGORIES.map(c => ({
      name: c.name,
      value: stats[c.id]
    })).filter(c => c.value > 0);
  }, [viewLog]);

  const changeDate = (days: number) => {
    const d = new Date(viewDateStr);
    d.setDate(d.getDate() + days);
    setViewDateStr(d.toISOString().split('T')[0]);
  };

  if (!state.user.gender) {
    return (
      <Onboarding 
        onSelect={(gender, name) => setState(prev => ({ ...prev, user: { ...prev.user, gender, name } }))} 
      />
    );
  }

  const isToday = viewDateStr === today;

  return (
    <div className="min-h-screen pb-24 bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl bg-white relative">
      <Header 
        totalPoints={Math.round(totalPoints)} 
        userName={state.user.name} 
        hijriDate={hijriDateDisplay}
        dayOfPeriod={dayOfPeriodDisplay}
      />

      <main className="flex-1 p-4 overflow-x-hidden">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Date Navigation */}
            <div className="flex items-center justify-between px-2">
              <button 
                onClick={() => changeDate(-1)}
                className="p-2 rounded-xl bg-gray-100 text-gray-400 hover:text-green-600 active:scale-90 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-800">{isToday ? 'اليوم' : viewDateStr}</p>
                {!isToday && <p className="text-[10px] text-gray-400">سجل اليوم السابق</p>}
              </div>
              <button 
                onClick={() => changeDate(1)}
                className="p-2 rounded-xl bg-gray-100 text-gray-400 hover:text-green-600 active:scale-90 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* View Date Score Summary */}
            <div className={`rounded-3xl p-6 text-white shadow-xl flex justify-between items-center transition-all ${isToday ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-100' : 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-100'}`}>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">نقاط هذا اليوم</p>
                <h2 className="text-4xl font-black">{viewDatePoints}</h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Zap className={`w-8 h-8 text-white fill-white ${isToday ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Sections */}
            {CATEGORIES.map((cat) => (
              <section key={cat.id} className="relative">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="text-lg font-black text-gray-800">{cat.name}</h2>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 px-1 -mx-4 sm:mx-0 snap-x">
                  <div className="min-w-[1px] h-full" />
                  {ACHIEVEMENTS.filter(a => a.category === cat.id).map(achievement => (
                    <div key={achievement.id} className="snap-start">
                      <AchievementCard 
                        achievement={achievement}
                        value={viewLog[achievement.id]}
                        gender={state.user.gender}
                        onChange={handleAchievementChange}
                        onInfo={setSelectedAchievement}
                      />
                    </div>
                  ))}
                  <div className="min-w-[1px] h-full" />
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">إحصائيات التقدم</h2>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 mb-6">نقاط آخر 30 يوماً</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8f8f8'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="points" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">متوسط النقاط</p>
                <p className="text-2xl font-black text-green-600">
                  {computedHistory.length > 0 
                    ? (totalPoints / computedHistory.length).toFixed(1) 
                    : 0}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">الأيام النشطة</p>
                <p className="text-2xl font-black text-blue-600">{activeDays}</p>
              </div>
            </div>

            {categoryStats.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 mb-2">توزيع النقاط</h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex flex-col items-center py-8">
               <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-xl">
                 {state.user.gender === 'male' ? '👨' : '👩'}
               </div>
               <h2 className="text-2xl font-black text-gray-900">{state.user.name}</h2>
               <p className="text-gray-400 font-medium">مستوى: باحث عن الأجر</p>
             </div>

             <div className="space-y-4">
                <h3 className="font-bold text-gray-800 px-2">أوسمة الإنجاز</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'البداية', icon: '🌱', threshold: 1, color: 'bg-green-50' },
                    { label: 'مجتهد', icon: '🔥', threshold: 100, color: 'bg-orange-50' },
                    { label: 'مثابر', icon: '🏆', threshold: 500, color: 'bg-blue-50' },
                    { label: 'فارس', icon: '🐎', threshold: 1000, color: 'bg-purple-50' },
                    { label: 'مخلص', icon: '💎', threshold: 5000, color: 'bg-cyan-50' },
                    { label: 'سابق', icon: '🦅', threshold: 10000, color: 'bg-yellow-50' },
                  ].map((badge, idx) => {
                    const isUnlocked = totalPoints >= badge.threshold;
                    return (
                      <div key={idx} className={`flex flex-col items-center p-4 rounded-3xl transition-all ${isUnlocked ? badge.color : 'bg-gray-100 grayscale'}`}>
                        <span className="text-2xl mb-1">{badge.icon}</span>
                        <span className={`text-[10px] font-bold ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-gray-700">سجل النشاط</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {computedHistory.slice(-3).reverse().map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500 font-medium">{h.date}</span>
                      <span className="text-sm font-black text-green-600">{h.points} نقطة</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">الإعدادات</h2>
            
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700">الجنس</span>
                </div>
                <select 
                  value={state.user.gender || ''} 
                  onChange={(e) => setState(prev => ({ ...prev, user: { ...prev.user, gender: e.target.value as Gender } }))}
                  className="bg-gray-50 border-0 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700">الخصوصية</span>
                </div>
                <span className="text-xs text-gray-400">بياناتك مخزنة محلياً</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700">نسخة احتياطية</span>
                </div>
                <button className="text-blue-600 text-xs font-bold hover:underline">تحميل</button>
              </div>
            </div>

            <button 
              onClick={resetData}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all border border-red-100"
            >
              <Trash2 className="w-5 h-5" />
              حذف جميع البيانات
            </button>
          </div>
        )}
      </main>

      <DetailsModal 
        achievement={selectedAchievement} 
        onClose={() => setSelectedAchievement(null)} 
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
