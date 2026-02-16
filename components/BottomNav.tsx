
import React from 'react';
import { Home, BarChart2, Settings, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'stats', icon: BarChart2, label: 'الإحصائيات' },
    { id: 'profile', icon: User, label: 'الملف' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white/95 backdrop-blur-2xl border-t border-gray-100 flex justify-around items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]" 
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)', paddingTop: '0.85rem' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1.5 group active-scale relative ${isActive ? 'text-green-600' : 'text-gray-300'}`}
          >
            <div className={`p-2.5 rounded-[1.25rem] transition-all duration-500 ${isActive ? 'bg-green-50 scale-110 shadow-inner' : 'bg-transparent'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-black tracking-wide transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
            {isActive && <div className="absolute -top-1 w-1 h-1 rounded-full bg-green-500 animate-pulse" />}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
