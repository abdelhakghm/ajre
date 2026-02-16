
import React from 'react';
import { Calendar, Trophy } from 'lucide-react';

interface HeaderProps {
  totalPoints: number;
  userName: string;
  hijriDate: string;
  dayOfPeriod: number;
}

const Header: React.FC<HeaderProps> = ({ totalPoints, userName, hijriDate, dayOfPeriod }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex flex-col gap-2 shadow-sm" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '0.75rem' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <span className="text-xl font-black">أ</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 leading-tight">اجر</h1>
            <p className="text-[10px] text-gray-400 font-medium">مرحباً، {userName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-black text-amber-700">{totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4 text-green-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-700 leading-none">{hijriDate}</span>
            <span className="text-[9px] text-gray-400 mt-1">{new Date().toLocaleDateString('ar-SA')} م</span>
          </div>
        </div>
        <div className="bg-green-50 px-2.5 py-1 rounded-xl border border-green-100 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-green-700 tracking-tight">اليوم {dayOfPeriod} من 30</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
