
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <span className="text-xl font-bold">أ</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">اجر</h1>
            <p className="text-[10px] text-gray-400">تقبل الله طاعتك، {userName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">{totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4 text-green-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold leading-none">{hijriDate}</span>
            <span className="text-[9px] text-gray-400 mt-1">{new Date().toLocaleDateString('ar-SA')} م</span>
          </div>
        </div>
        <div className="bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
          <span className="text-[10px] font-bold text-green-700">اليوم {dayOfPeriod} من 30</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
