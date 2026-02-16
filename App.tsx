
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
import { Settings, Trash2, ShieldCheck, Download, Calendar, Zap, ChevronRight, ChevronLeft, User, RotateCcw, Info, Plus } from 'lucide-react';

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

  // Extract Tasbih for special rendering
  const tasbihAchievement = useMemo(() => ACHIEVEMENTS.find(a => a.id === 'tasbih'), []);
  const tasbihValue = (viewLog['tasbih'] as number) || 0;

  if (!state.user.gender) {
    return (
      <Onboarding 
        onSelect={(gender, name) => setState(prev => ({ ...prev, user: { ...prev.user, gender, name } }))} 
      />
    );
  }

  const isToday = viewDateStr === today;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto relative shadow-2xl min-h-screen">
      <Header 
        totalPoints={Math.round(totalPoints)} 
        userName={state.user.name} 
        hijriDate={hijriDateDisplay}
        dayOfPeriod={dayOfPeriodDisplay}
      />

      <main className="flex-1 p-4 overflow-x-hidden space-y-6 pb-28">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Date Navigation */}
            <div className="flex items-center justify-between px-2 bg-white/50 p-2 rounded-2xl border border-white">
              <button 
                onClick={() => changeDate(-1)}
                className="p-2.5 rounded-xl bg-white shadow-sm text-gray-400 hover:text-green-600 active-scale transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-xs font-black text-gray-900">{isToday ? 'اليوم' : viewDateStr}</p>
                {!isToday && <p className="text-[10px] text-gray-400 font-bold">سجل الأيام السابقة</p>}
              </div>
              <button 
                onClick={() => changeDate(1)}
                className="p-2.5 rounded-xl bg-white shadow-sm text-gray-400 hover:text-green-600 active-scale transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* View Date Score Summary */}
            <div className={`rounded-3xl p-6 text-white shadow-2xl flex justify-between items-center transition-all duration-500 ${isToday ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-100' : 'bg-gradient-to-br from-gray-500 to-gray-700 shadow-gray-100'}`}>
              <div>
                <p className="text-white/80 text-xs font-bold mb-1">نقاط الإنجاز</p>
                <h2 className="text-4xl font-black">{viewDatePoints}</h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Zap className={`w-8 h-8 text-white fill-white ${isToday ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Special Tasbih Section */}
            {tasbihAchievement && (
              <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                       <i className="fas fa-leaf text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">قسم التسبيح</h2>
                      <p className="text-[10px] text-gray-400 font-bold">الهدف: 100 تسبيحة</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAchievement(tasbihAchievement)}
                    className="p-2 text-gray-300 hover:text-green-600 active-scale transition-all"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                   <div className="relative flex items-center justify-center">
                     {/* Circular Progress (Simplified SVG) */}
                     <svg className="w-40 h-40 transform -rotate-90">
                       <circle
                         cx="80"
                         cy="80"
                         r="70"
                         stroke="currentColor"
                         strokeWidth="8"
                         fill="transparent"
                         className="text-gray-100"
                       />
                       <circle
                         cx="80"
                         cy="80"
                         r="70"
                         stroke="currentColor"
                         strokeWidth="8"
                         strokeDasharray={440}
                         strokeDashoffset={440 - (Math.min(tasbihValue, 100) / 100) * 440}
                         strokeLinecap="round"
                         fill="transparent"
                         className="text-green-500 transition-all duration-500"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black text-gray-900">{tasbihValue}</span>
                       <span className={`text-[10px] font-black mt-1 ${tasbihValue >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                         {tasbihValue >= 100 ? 'تم تحقيق الهدف ✨' : 'تسبيحة'}
                       </span>
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 w-full">
                     <button 
                       onClick={() => handleAchievementChange('tasbih', 0)}
                       className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl text-gray-400 active-scale border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all"
                     >
                       <RotateCcw className="w-5 h-5 mb-1" />
                       <span className="text-[9px] font-black uppercase">تصفير</span>
                     </button>
                     
                     <button 
                       onClick={() => handleAchievementChange('tasbih', tasbihValue + 10)}
                       className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-2xl text-green-700 active-scale border border-green-100 hover:bg-green-100 transition-all"
                     >
                       <Plus className="w-5 h-5 mb-1" />
                       <span className="text-[10px] font-black uppercase">+10</span>
                     </button>

                     <button 
                       onClick={() => handleAchievementChange('tasbih', tasbihValue + 1)}
                       className="flex flex-col items-center justify-center p-3 bg-green-600 rounded-2xl text-white active-scale shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                     >
                       <Plus className="w-5 h-5 mb-1" />
                       <span className="text-[10px] font-black uppercase">+1</span>
                     </button>
                   </div>
                </div>
              </section>
            )}

            {/* Sections */}
            {CATEGORIES.map((cat) => (
              <section key={cat.id} className="relative">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-xl filter drop-shadow-sm">{cat.icon}</span>
                  <h2 className="text-lg font-black text-gray-900">{cat.name}</h2>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 px-1 -mx-4 sm:mx-0 snap-x">
                  <div className="min-w-[4px] h-full" />
                  {ACHIEVEMENTS.filter(a => a.category === cat.id && a.id !== 'tasbih').map(achievement => (
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
                  <div className="min-w-[4px] h-full" />
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900 px-2">إحصائيات التقدم</h2>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-wider">نقاط آخر 30 يوماً</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8f8f8'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="points" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase">متوسط النقاط</p>
                <p className="text-2xl font-black text-green-600">
                  {computedHistory.length > 0 
                    ? (totalPoints / computedHistory.length).toFixed(1) 
                    : 0}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase">الأيام النشطة</p>
                <p className="text-2xl font-black text-blue-600">{activeDays}</p>
              </div>
            </div>

            {categoryStats.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 mb-2 uppercase">توزيع النقاط</h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
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
               <div className="relative">
                 <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center text-5xl border-4 border-green-50 shadow-2xl">
                   {state.user.gender === 'male' ? '👨' : '👩'}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                   <Zap className="w-5 h-5 fill-white" />
                 </div>
               </div>
               <h2 className="text-2xl font-black text-gray-900 mt-6">{state.user.name}</h2>
               <p className="text-green-600 font-bold text-sm bg-green-50 px-4 py-1 rounded-full mt-2">المسابق المخلص</p>
             </div>

             <div className="space-y-4">
                <h3 className="font-black text-gray-800 px-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                  أوسمة الإنجاز
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'البداية', icon: '🌱', threshold: 1, color: 'bg-green-50 text-green-700' },
                    { label: 'مجتهد', icon: '🔥', threshold: 100, color: 'bg-orange-50 text-orange-700' },
                    { label: 'مثابر', icon: '🏆', threshold: 500, color: 'bg-blue-50 text-blue-700' },
                    { label: 'فارس', icon: '🐎', threshold: 1000, color: 'bg-purple-50 text-purple-700' },
                    { label: 'مخلص', icon: '💎', threshold: 5000, color: 'bg-cyan-50 text-cyan-700' },
                    { label: 'سابق', icon: '🦅', threshold: 10000, color: 'bg-yellow-50 text-yellow-700' },
                  ].map((badge, idx) => {
                    const isUnlocked = totalPoints >= badge.threshold;
                    return (
                      <div key={idx} className={`flex flex-col items-center p-4 rounded-3xl transition-all shadow-sm ${isUnlocked ? badge.color : 'bg-gray-100 grayscale border border-gray-100'}`}>
                        <span className="text-3xl mb-1">{badge.icon}</span>
                        <span className={`text-[10px] font-black ${isUnlocked ? '' : 'text-gray-400'}`}>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="font-black text-gray-800">سجل النشاط</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {computedHistory.length === 0 ? (
                    <p className="text-center py-4 text-xs text-gray-400 font-bold italic">لا يوجد سجل نشاط بعد</p>
                  ) : (
                    computedHistory.slice(-4).reverse().map((h, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-xs text-gray-500 font-black">{h.date}</span>
                        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">+{h.points} نقطة</span>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900 px-2">الإعدادات</h2>
            
            <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between active-scale">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-black text-gray-800">الجنس</span>
                </div>
                <select 
                  value={state.user.gender || ''} 
                  onChange={(e) => setState(prev => ({ ...prev, user: { ...prev.user, gender: e.target.value as Gender } }))}
                  className="bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-black focus:ring-2 focus:ring-green-500 appearance-none text-gray-700"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="p-5 border-b border-gray-50 flex items-center justify-between active-scale">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-black text-gray-800">الخصوصية</span>
                </div>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">بياناتك محلية 🔐</span>
              </div>

              <div className="p-5 flex items-center justify-between active-scale">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 shadow-sm">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="font-black text-gray-800">البيانات</span>
                </div>
                <button className="text-blue-600 text-xs font-black hover:underline px-4 py-2 bg-blue-50 rounded-xl">تصدير</button>
              </div>
            </div>

            <button 
              onClick={resetData}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-red-50 text-red-600 font-black rounded-[2rem] hover:bg-red-100 transition-all border border-red-100 active-scale shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
              حذف جميع البيانات
            </button>

            <div className="text-center py-6">
              <p className="text-[10px] text-gray-400 font-black">إصدار التطبيق 1.0.0</p>
              <p className="text-[9px] text-gray-300 font-bold mt-1">صنع بكل إخلاص لخدمتكم</p>
            </div>
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
