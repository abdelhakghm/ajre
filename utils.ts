
import { ACHIEVEMENTS } from './constants';
import { DailyLog, Gender, AchievementType } from './types';

export const calculatePoints = (log: DailyLog, gender: Gender): number => {
  let total = 0;
  
  ACHIEVEMENTS.forEach(achievement => {
    const value = log[achievement.id];
    if (!value) return;

    if (achievement.type === AchievementType.PRAYER) {
      if (gender === 'male') {
        if (value === 'mosque') total += 2;
        else if (value === 'ontime') total += 1;
        else if (value === 'normal') total += 0.5;
      } else {
        if (value === 'ontime') total += 2;
        else if (value === 'normal') total += 1;
      }
    } else if (achievement.type === AchievementType.COUNTER) {
      const count = value as number;
      if (achievement.id === 'rawatib' || achievement.id === 'duha') {
        total += Math.floor(count / 2);
      } else if (achievement.id === 'tasbih' && count >= 100) {
        total += 1;
      }
    } else if (achievement.type === AchievementType.PAGES) {
      total += (value as number);
    } else if (achievement.type === AchievementType.CHECKBOX) {
      if (value === true) total += 1;
    }
  });

  return total;
};

export const getTodayDateStr = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Converts a Gregorian date to a Hijri string format
 */
export const getHijriDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

/**
 * Calculates the day number (1-30) based on a fixed start date
 */
export const getDayOfPeriod = (currentDate: Date, startDate: Date): number => {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const current = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (diffDays < 1) return 1;
  if (diffDays > 30) return 30;
  return diffDays;
};

export const getAchievementProgress = (achievementId: string, log: DailyLog): number => {
  const value = log[achievementId];
  if (!value) return 0;
  
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return 0;

  if (achievement.type === AchievementType.CHECKBOX) return value ? 100 : 0;
  if (achievement.type === AchievementType.COUNTER && achievement.target) {
    return Math.min(100, ((value as number) / achievement.target) * 100);
  }
  return 0;
};
