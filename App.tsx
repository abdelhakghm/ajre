
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
  const [viewDateStr, setViewDateStr] = useState(getTodayDateStr());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const today = useMemo(() => getTodayDateStr(), []);
  const hijriDateDisplay = useMemo(() => getHijriDate(new Date()), []);
  const dayOfPeriodDisplay = useMemo(() => getDayOfPeriod(new Date(), PERIOD_START_DATE), []);

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
    return CATEGORIES.map(c => ({ name: c.name, value: stats[c.id] })).filter(c => c.value > 0);
  }, [viewLog]);

  const changeDate = (days: number) => {
    const d = new Date(viewDateStr);
    d.setDate(d.getDate() + days);
    setViewDateStr(d.toISOString().split('T')[0]);
  };

  const tasbihAchievement = useMemo(() => ACHIEVEMENTS.find(a => a.id === 'tasbih'), []);
  const tasbihValue = (viewLog['tasbih'] as number) || 0;

  if (!state.user.gender) {
    return <Onboarding onSelect={(gender, name) => setState(prev => ({ ...prev, user: { ...prev.user, gender, name } }))} />;
  }

  const isToday = viewDateStr === today;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-full relative shadow-none min-h-screen">
      <Header 
        totalPoints={Math.round(totalPoints)} 
        userName={state.user.name} 
        hijriDate={hijriDateDisplay}
        dayOfPeriod={dayOfPeriodDisplay}
      />

      <main className="flex-1 p-4 overflow-x-hidden space-y-8 pb-32">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Date Navigation - Centered and Styled */}
            <div className="flex items-center justify-between px-3 bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
              <button onClick={() => changeDate(-1)} className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 active-scale transition-all hover:bg-green-50 hover:text-green-600">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-sm font-black text-gray-900 leading-none">{isToday ? 'اليوم' : viewDateStr}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-wide">{isToday ? 'تقبل الله طاعاتكم' : 'سجل النشاط الماضي'}</p>
              </div>
              <button onClick={() => changeDate(1)} className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 active-scale transition-all hover:bg-green-50 hover:text-green-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Centered Large Score Card */}
            <div className={`mx-auto w-full rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col items-center justify-center text-center transition-all duration-500 ${isToday ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-100' : 'bg-gradient-to-br from-gray-500 to-gray-700 shadow-gray-100'}`}>
              <p className="text-white/80 text-xs font-black mb-1 uppercase tracking-widest">مجموع نقاطك لهذا اليوم</p>
              <h2 className="text-6xl font-black mb-2">{viewDatePoints}</h2>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mt-2">
                <Zap className={`w-6 h-6 text-white fill-white ${isToday ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Special Tasbih Section - Focused Centerpiece */}
            {tasbihAchievement && (
              <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-50 rounded-[1.25rem] flex items-center justify-center text-green-600 border border-green-100">
                       <i className="fas fa-leaf text-2xl"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">مسبحة الأجر</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">الهدف اليومي: 100</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAchievement(tasbihAchievement)} className="p-3 text-gray-300 hover:text-green-600 active-scale transition-all">
                    <Info className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col items-center w-full max-w-xs">
                   <div className="relative flex items-center justify-center mb-8">
                     <svg className="w-52 h-52 transform -rotate-90">
                       <circle cx="104" cy="104" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                       <circle cx="104" cy="104" r="90" stroke="currentColor" strokeWidth="12" strokeDasharray={565} strokeDashoffset={565 - (Math.min(tasbihValue, 100) / 100) * 565} strokeLinecap="round" fill="transparent" className="text-green-500 transition-all duration-700 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-6xl font-black text-gray-900 tracking-tighter">{tasbihValue}</span>
                       <span className={`text-[11px] font-black mt-1 ${tasbihValue >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                         {tasbihValue >= 100 ? 'أحسنت! استمر ✨' : 'تسبيحة مباركة'}
                       </span>
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-5 w-full">
                     <button onClick={() => handleAchievementChange('tasbih', 0)} className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-3xl text-gray-400 active-scale border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all">
                       <RotateCcw className="w-5 h-5 mb-1" />
                       <span className="text-[10px] font-black uppercase tracking-tight">تصفير</span>
                     </button>
                     <button onClick={() => handleAchievementChange('tasbih', tasbihValue + 10)} className="flex flex-col items-center justify-center py-4 bg-green-50 rounded-3xl text-green-700 active-scale border border-green-100 hover:bg-green-100 transition-all">
                       <Plus className="w-5 h-5 mb-1" />
                       <span className="text-[10px] font-black uppercase tracking-tight">+10</span>
                     </button>
                     <button onClick={() => handleAchievementChange('tasbih', tasbihValue + 1)} className="flex flex-col items-center justify-center py-4 bg-green-600 rounded-3xl text-white active-scale shadow-xl shadow-green-200 hover:bg-green-700 transition-all">
                       <Plus className="w-6 h-6 mb-1" />
                       <span className="text-[10px] font-black uppercase tracking-tight">+1</span>
                     </button>
                   </div>
                </div>
              </section>
            )}

            {/* Achievement Sections - Improved Centering & Horizontal Scroll */}
            {CATEGORIES.map((cat) => (
              <section key={cat.id} className="relative w-full">
                <div className="flex items-center gap-3 mb-5 px-2">
                  <span className="text-2xl filter drop-shadow-md">{cat.icon}</span>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">{cat.name}</h2>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 snap-x snap-mandatory px-2 -mx-2 sm:mx-0">
                  {ACHIEVEMENTS.filter(a => a.category === cat.id && a.id !== 'tasbih').map(achievement => (
                    <div key={achievement.id} className="snap-center first:ml-0 last:mr-0">
                      <AchievementCard 
                        achievement={achievement}
                        value={viewLog[achievement.id]}
                        gender={state.user.gender}
                        onChange={handleAchievementChange}
                        onInfo={setSelectedAchievement}
                      />
                    </div>
                  ))}
                  {/* Invisible spacer to allow full scroll */}
                  <div className="min-w-[1px] h-1 opacity-0" />
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Stats, Profile, Settings are similar but more centered */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-sm mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center">إحصائياتك</h2>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-[11px] font-black text-gray-400 mb-6 uppercase text-center tracking-widest">نقاط آخر 30 يوماً</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="points" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* ... other stats sections ... */}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-sm mx-auto">
             <div className="flex flex-col items-center py-10">
               <div className="relative">
                 <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-6xl border-4 border-green-50 shadow-2xl">
                   {state.user.gender === 'male' ? '👨' : '👩'}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                   <Zap className="w-6 h-6 fill-white" />
                 </div>
               </div>
               <h2 className="text-3xl font-black text-gray-900 mt-8 tracking-tight">{state.user.name}</h2>
               <div className="flex items-center gap-2 mt-3">
                 <div className="h-1 w-8 bg-green-500 rounded-full"></div>
                 <p className="text-green-600 font-black text-xs uppercase tracking-widest">المسابق المخلص</p>
                 <div className="h-1 w-8 bg-green-500 rounded-full"></div>
               </div>
             </div>
             {/* ... achievements ... */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-sm mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center">الإعدادات</h2>
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm px-2">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between active-scale">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="font-black text-gray-800 tracking-tight">الجنس</span>
                </div>
                <select 
                  value={state.user.gender || ''} 
                  onChange={(e) => setState(prev => ({ ...prev, user: { ...prev.user, gender: e.target.value as Gender } }))}
                  className="bg-gray-100 border-0 rounded-2xl px-5 py-3 text-sm font-black focus:ring-2 focus:ring-green-500 appearance-none text-gray-700"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              {/* ... other settings ... */}
            </div>
            <button onClick={resetData} className="w-full flex items-center justify-center gap-3 py-6 px-8 bg-red-50 text-red-600 font-black rounded-[2.5rem] hover:bg-red-100 transition-all border border-red-100 active-scale shadow-sm">
              <Trash2 className="w-6 h-6" />
              حذف جميع البيانات
            </button>
          </div>
        )}
      </main>

      <DetailsModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
