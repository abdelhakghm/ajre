
import React from 'react';
import { Achievement } from '../types';
import { X, BookOpen, Star, Lightbulb, ClipboardList, AlertCircle } from 'lucide-react';

interface DetailsModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-green-50">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100"
            >
              <i className={`${achievement.icon} text-3xl`} style={{ color: achievement.iconColor }}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{achievement.name}</h2>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">معلومات الإنجاز</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
          <section>
            <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
              <BookOpen className="w-5 h-5" />
              <h3>الشرح</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2 text-yellow-600 font-bold">
              <Star className="w-5 h-5" />
              <h3>الفضائل</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">"{achievement.virtues}"</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
              <Lightbulb className="w-5 h-5" />
              <h3>نصائح عملية</h3>
            </div>
            <ul className="space-y-2">
              {achievement.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold">
              <ClipboardList className="w-5 h-5" />
              <h3>التعليمات</h3>
            </div>
            <div className="space-y-3">
              {achievement.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-red-500 font-bold">
              <AlertCircle className="w-5 h-5" />
              <h3>ملاحظات مهمة</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{achievement.notes}</p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
          >
            فهمت، جزاكم الله خيراً
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
