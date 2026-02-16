
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
          <div className="flex gap-2 w-full mt-3">
            {gender === 'male' ? (
              <>
                <button 
                  onClick={() => onChange(achievement.id, 'mosque')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${value === 'mosque' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  في المسجد
                </button>
                <button 
                  onClick={() => onChange(achievement.id, 'ontime')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${value === 'ontime' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  في وقتها
                </button>
              </>
            ) : (
              <button 
                onClick={() => onChange(achievement.id, value === 'ontime' ? null : 'ontime')}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${value === 'ontime' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                في وقتها
              </button>
            )}
            <button 
              onClick={() => onChange(achievement.id, value === 'normal' ? null : 'normal')}
              className={`px-2 py-2 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${value === 'normal' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              متأخرة
            </button>
          </div>
        );

      case AchievementType.COUNTER:
      case AchievementType.PAGES:
        const count = value || 0;
        return (
          <div className="flex items-center justify-between w-full mt-3 bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => onChange(achievement.id, Math.max(0, count - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-400 hover:text-red-500 transition-colors active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col items-center">
               <span className="text-base font-bold text-green-700 leading-none">{count}</span>
               <span className="text-[9px] text-gray-400 mt-0.5">
                {achievement.type === AchievementType.PAGES ? 'صفحة' : 'مرة/ركعة'}
               </span>
            </div>
            <button 
              onClick={() => onChange(achievement.id, count + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-400 hover:text-green-500 transition-colors active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case AchievementType.CHECKBOX:
        return (
          <button 
            onClick={() => onChange(achievement.id, !value)}
            className={`w-full mt-3 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
          >
            {value ? <Check className="w-4 h-4" /> : null}
            <span className="text-xs">{value ? 'تم العمل' : 'تحديد كمكتمل'}</span>
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-start min-w-[155px] max-w-[155px] flex-shrink-0 transition-transform hover:translate-y-[-2px]">
      <div className="flex justify-between items-start w-full mb-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10 transition-transform group hover:scale-110"
          style={{ backgroundColor: `${achievement.iconColor}20` }}
        >
          <i className={`${achievement.icon} text-xl`} style={{ color: achievement.iconColor }}></i>
        </div>
        <button 
          onClick={() => onInfo(achievement)}
          className="text-gray-300 hover:text-blue-500 transition-colors p-1"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-bold text-gray-800 text-xs truncate w-full">{achievement.name}</h3>
      {renderControl()}
    </div>
  );
};

export default AchievementCard;
