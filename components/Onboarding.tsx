
import React from 'react';
import { Gender } from '../types';

interface OnboardingProps {
  onSelect: (gender: Gender, name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelect }) => {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<Gender>(null);

  const handleSubmit = () => {
    if (name && gender) {
      onSelect(gender, name);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-green-200 mb-8 animate-bounce">
        <span className="text-4xl font-bold">أ</span>
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-2">أهلاً بك في "اجر"</h1>
      <p className="text-gray-500 mb-10 max-w-[280px]">تطبيقك اليومي لتتبع العبادات وبلوغ أعلى الدرجات بإذن الله.</p>

      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-2 text-right">
          <label className="text-sm font-bold text-gray-700 mr-2">ما هو اسمك؟</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-center font-bold"
            placeholder="اكتب اسمك هنا"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-bold text-gray-700 mr-2">الجنس (لتخصيص نظام النقاط):</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setGender('male')}
              className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${gender === 'male' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
            >
              <span className="text-3xl">👨</span>
              <span className="font-bold">ذكر</span>
            </button>
            <button 
              onClick={() => setGender('female')}
              className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${gender === 'female' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
            >
              <span className="text-3xl">👩</span>
              <span className="font-bold">أنثى</span>
            </button>
          </div>
        </div>

        <button 
          disabled={!name || !gender}
          onClick={handleSubmit}
          className="w-full py-5 bg-green-600 disabled:bg-gray-200 text-white font-bold rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 disabled:shadow-none"
        >
          ابدأ رحلة الإيمان
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
