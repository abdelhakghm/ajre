
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
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center z-40 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]" 
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)', paddingTop: '0.75rem' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 group active-scale ${isActive ? 'text-green-600' : 'text-gray-400'}`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-green-50 scale-110' : 'bg-transparent group-hover:bg-gray-50'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-bold transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
