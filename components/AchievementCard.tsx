
import React from 'react';
import { Achievement, AchievementType, Gender } from '../types';
import { Info, Plus, Minus, Check } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  value: any;
  gender: Gender;
  onChange: (id: string, value: any) => void;
  onInfo: (achievement: Achievement) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, value, gender, onChange, onInfo }) => {
  const renderControl = () => {
    switch (achievement.type) {
      case AchievementType.PRAYER:
        return (
          <div className="flex flex-col gap-2 w-full mt-4">
            <div className="flex gap-2">
              {gender === 'male' ? (
                <>
                  <button 
                    onClick={() => onChange(achievement.id, 'mosque')}
                    className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all active:scale-90 ${value === 'mosque' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
                  >
                    بالمسجد
                  </button>
                  <button 
                    onClick={() => onChange(achievement.id, 'ontime')}
                    className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all active:scale-90 ${value === 'ontime' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
                  >
                    بوقتها
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => onChange(achievement.id, value === 'ontime' ? null : 'ontime')}
                  className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all active:scale-90 ${value === 'ontime' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
                >
                  في وقتها
                </button>
              )}
            </div>
            <button 
              onClick={() => onChange(achievement.id, value === 'normal' ? null : 'normal')}
              className={`w-full py-2.5 text-[10px] font-black rounded-xl transition-all active:scale-90 ${value === 'normal' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
            >
              صليت متأخراً
            </button>
          </div>
        );

      case AchievementType.COUNTER:
      case AchievementType.PAGES:
        const count = value || 0;
        return (
          <div className="flex items-center justify-between w-full mt-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => onChange(achievement.id, Math.max(0, count - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-300 hover:text-red-500 transition-colors active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center">
               <span className="text-xl font-black text-green-700 leading-none">{count}</span>
               <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                {achievement.type === AchievementType.PAGES ? 'صفحة' : 'مرة'}
               </span>
            </div>
            <button 
              onClick={() => onChange(achievement.id, count + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-300 hover:text-green-600 transition-colors active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        );

      case AchievementType.CHECKBOX:
        return (
          <button 
            onClick={() => onChange(achievement.id, !value)}
            className={`w-full mt-4 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-90 ${value ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
          >
            {value ? <Check className="w-4 h-4 stroke-[3px]" /> : null}
            <span className="text-xs uppercase tracking-tight">{value ? 'تم الإنجاز' : 'تم العمل'}</span>
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col items-center min-w-[170px] max-w-[170px] flex-shrink-0 transition-all hover:shadow-md snap-center">
      <div className="flex justify-between items-start w-full mb-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
          style={{ backgroundColor: `${achievement.iconColor}10` }}
        >
          <i className={`${achievement.icon} text-xl`} style={{ color: achievement.iconColor }}></i>
        </div>
        <button 
          onClick={() => onInfo(achievement)}
          className="text-gray-200 hover:text-blue-500 transition-colors p-1"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      <h3 className="font-black text-gray-900 text-sm text-center tracking-tight leading-tight px-1 h-10 flex items-center">{achievement.name}</h3>
      {renderControl()}
    </div>
  );
};

export default AchievementCard;
