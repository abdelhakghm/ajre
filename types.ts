
export type Gender = 'male' | 'female' | null;

export enum AchievementType {
  CHECKBOX = 'CHECKBOX',
  COUNTER = 'COUNTER',
  PAGES = 'PAGES',
  PRAYER = 'PRAYER'
}

export interface Achievement {
  id: string;
  name: string;
  category: string;
  type: AchievementType;
  icon: string; // Font Awesome class string
  iconColor: string; // Tailwind color class or hex
  description: string;
  virtues: string;
  tips: string[];
  instructions: string[];
  notes: string;
  pointsRule: string;
  target?: number;
}

export interface DailyLog {
  [achievementId: string]: number | boolean | string;
}

export interface UserStats {
  totalPoints: number;
  activeDays: number;
  gender: Gender;
  name: string;
}

export interface AppState {
  user: UserStats;
  logs: { [date: string]: DailyLog };
  history: { date: string; points: number }[];
}
