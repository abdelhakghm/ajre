
import { Achievement, AchievementType } from './types';

// Default start date for the 30-day challenge (e.g., Ramadan 1)
// Adjust this date as needed
export const PERIOD_START_DATE = new Date(2025, 2, 1); // Example: March 1, 2025

export const CATEGORIES = [
  { id: 'obligatory', name: 'الصلوات المفروضة', icon: '🕌' },
  { id: 'sunnah', name: 'الصلوات النوافل', icon: '✨' },
  { id: 'azkar', name: 'الأذكار', icon: '📿' },
  { id: 'quran', name: 'القرآن الكريم', icon: '📖' },
  { id: 'others', name: 'أعمال صالحة', icon: '❤️' }
];

export const ACHIEVEMENTS: Achievement[] = [
  // Obligatory Prayers
  {
    id: 'fajr',
    name: 'صلاة الفجر',
    category: 'obligatory',
    type: AchievementType.PRAYER,
    icon: 'fas fa-mosque',
    iconColor: '#10b981', // Green
    description: 'صلاة الفجر هي أول الصلوات المفروضة في اليوم، وهي من أفضل الصلوات.',
    virtues: 'قال النبي صلى الله عليه وسلم: "من صلى الفجر فهو في ذمة الله".',
    tips: ['حاول الاستيقاظ مبكراً', 'تجهز الملابس في الليل', 'ضع منبهاً بعيداً عن السرير'],
    instructions: ['قم بالوضوء الصحيح', 'صل الركعتين السنة قبل الفريضة', 'صل الفريضة بجماعة إن أمكن'],
    notes: 'صلاة الفجر في المسجد تساوي نقطتين (للذكور)، وفي الوقت تساوي نقطتين (للإناث).',
    pointsRule: 'mosque:2,ontime:2,normal:1'
  },
  {
    id: 'dhuhr',
    name: 'صلاة الظهر',
    category: 'obligatory',
    type: AchievementType.PRAYER,
    icon: 'fas fa-sun',
    iconColor: '#f59e0b', // Yellow/Amber
    description: 'صلاة الظهر وقت اشتداد الحر، وهي تذكير بالله وسط انشغال العمل.',
    virtues: 'تفتح لها أبواب السماء.',
    tips: ['توقف عن العمل قبل الأذان بـ 5 دقائق', 'حافظ على السنن الرواتب'],
    instructions: ['الوضوء', 'التوجه للمصلى', 'الصلاة بخشوع'],
    notes: 'نقطتان للمسجد أو للإناث في الوقت.',
    pointsRule: 'mosque:2,ontime:2,normal:1'
  },
  {
    id: 'asr',
    name: 'صلاة العصر',
    category: 'obligatory',
    type: AchievementType.PRAYER,
    icon: 'fas fa-cloud-sun',
    iconColor: '#6366f1', // Indigo
    description: 'هي الصلاة الوسطى التي أمرنا الله بالمحافظة عليها خصوصاً.',
    virtues: 'قال صلى الله عليه وسلم: "من صلى البردين دخل الجنة" (البردين هما الفجر والعصر).',
    tips: ['استعد للصلاة فور سماع الأذان', 'لا تؤخرها حتى اصفرار الشمس'],
    instructions: ['الوضوء', 'صلاة 4 ركعات فريضة'],
    notes: 'عظم أجرها كبير جداً.',
    pointsRule: 'mosque:2,ontime:2,normal:1'
  },
  {
    id: 'maghrib',
    name: 'صلاة المغرب',
    category: 'obligatory',
    type: AchievementType.PRAYER,
    icon: 'fas fa-sun',
    iconColor: '#f97316', // Orange
    description: 'صلاة وقت غروب الشمس، وهي بداية اليوم الإسلامي الجديد.',
    virtues: 'هي وتر النهار.',
    tips: ['بادر بالصلاة فموقعها ضيق نوعاً ما'],
    instructions: ['3 ركعات فريضة'],
    notes: 'نقطتان للمسجد أو للإناث في الوقت.',
    pointsRule: 'mosque:2,ontime:2,normal:1'
  },
  {
    id: 'isha',
    name: 'صلاة العشاء',
    category: 'obligatory',
    type: AchievementType.PRAYER,
    icon: 'fas fa-moon',
    iconColor: '#374151', // Dark Gray
    description: 'ختام صلوات النهار المفروضة.',
    virtues: 'من صلى العشاء في جماعة فكأنما قام نصف الليل.',
    tips: ['تجنب النوم قبلها'],
    instructions: ['4 ركعات فريضة'],
    notes: 'نقطتان للمسجد أو للإناث في الوقت.',
    pointsRule: 'mosque:2,ontime:2,normal:1'
  },

  // Sunnah
  {
    id: 'rawatib',
    name: 'السنن الرواتب',
    category: 'sunnah',
    type: AchievementType.COUNTER,
    icon: 'fas fa-hands-praying',
    iconColor: '#10b981',
    target: 12,
    description: 'هي السنن المرتبطة بالصلوات المفروضة (2 قبل الفجر، 4 قبل الظهر، 2 بعده، 2 بعد المغرب، 2 بعد العشاء).',
    virtues: 'بنى الله له بيتاً في الجنة.',
    tips: ['عود نفسك على البقاء قليلاً بعد الصلاة'],
    instructions: ['صلها ركعتين ركعتين'],
    notes: 'نقطة لكل ركعتين.',
    pointsRule: 'per2:1'
  },
  {
    id: 'duha',
    name: 'صلاة الضحى',
    category: 'sunnah',
    type: AchievementType.COUNTER,
    icon: 'fas fa-sun',
    iconColor: '#fcd34d',
    target: 8,
    description: 'صلاة الأوابين، ووقتها من بعد شروق الشمس بـ 15 دقيقة إلى قبل الظهر.',
    virtues: 'تجزئ عن صدقة كل سلامى (مفصل) في جسمك.',
    tips: ['صلها في البيت أو في العمل'],
    instructions: ['أقلها ركعتان وأكثرها 8 ركعات'],
    notes: 'نقطة لكل ركعتين.',
    pointsRule: 'per2:1'
  },

  // Azkar
  {
    id: 'morning_azkar',
    name: 'أذكار الصباح',
    category: 'azkar',
    type: AchievementType.CHECKBOX,
    icon: 'fas fa-dove',
    iconColor: '#0ea5e9',
    description: 'حصن المسلم اليومي.',
    virtues: 'حفظ من الشيطان وسكينة للقلب.',
    tips: ['اقرأها بعد صلاة الفجر مباشرة'],
    instructions: ['استخدم كتيب أو تطبيق الأذكار'],
    notes: 'نقطة واحدة عند الإكمال.',
    pointsRule: 'fixed:1'
  },
  {
    id: 'evening_azkar',
    name: 'أذكار المساء',
    category: 'azkar',
    type: AchievementType.CHECKBOX,
    icon: 'fas fa-star',
    iconColor: '#8b5cf6',
    description: 'حصن المساء.',
    virtues: 'حماية وهدوء.',
    tips: ['اقرأها بعد صلاة العصر أو قبل الغروب'],
    instructions: ['التركيز في معاني الذكر'],
    notes: 'نقطة واحدة عند الإكمال.',
    pointsRule: 'fixed:1'
  },
  {
    id: 'tasbih',
    name: 'التسبيح (100 مرة)',
    category: 'azkar',
    type: AchievementType.COUNTER,
    icon: 'fas fa-leaf',
    iconColor: '#22c55e',
    target: 100,
    description: 'قول سبحان الله وبحمده.',
    virtues: 'غفرت خطاياه وإن كانت مثل زبد البحر.',
    tips: ['استخدم مسبحة أو أناملك'],
    instructions: ['كررها 100 مرة في اليوم'],
    notes: 'نقطة عند بلوغ الـ 100.',
    pointsRule: 'target:1'
  },

  // Quran
  {
    id: 'quran_reading',
    name: 'قراءة القرآن',
    category: 'quran',
    type: AchievementType.PAGES,
    icon: 'fas fa-book',
    iconColor: '#059669',
    description: 'تلاوة آيات الله البينات.',
    virtues: 'الحرف بحسنة، والحسنة بعشر أمثالها.',
    tips: ['حدد ورد يومي ثابت'],
    instructions: ['تطهر ثم ابدأ بالقراءة'],
    notes: 'نقطة لكل صفحة.',
    pointsRule: 'per1:1'
  },
  {
    id: 'tafsir',
    name: 'قراءة التفسير',
    category: 'quran',
    type: AchievementType.PAGES,
    icon: 'fas fa-book-open',
    iconColor: '#047857',
    description: 'فهم معاني القرآن الكريم.',
    virtues: 'من سلك طريقاً يلتمس فيه علماً سهل الله له طريقاً إلى الجنة.',
    tips: ['ابدأ بكتب التفسير الميسر'],
    instructions: ['اقرأ الآية ثم تفسيرها'],
    notes: 'نقطة لكل صفحة.',
    pointsRule: 'per1:1'
  },

  // Others
  {
    id: 'parents',
    name: 'بر الوالدين',
    category: 'others',
    type: AchievementType.CHECKBOX,
    icon: 'fas fa-users',
    iconColor: '#f43f5e',
    description: 'الإحسان إلى الوالدين بالقول والفعل.',
    virtues: 'رضا الرب في رضا الوالدين.',
    tips: ['ابتسامة في وجههما كافية كبداية'],
    instructions: ['مساعدة، اتصال، أو كلمة طيبة'],
    notes: 'نقطة واحدة.',
    pointsRule: 'fixed:1'
  },
  {
    id: 'charity',
    name: 'الصدقة',
    category: 'others',
    type: AchievementType.CHECKBOX,
    icon: 'fas fa-hand-holding-heart',
    iconColor: '#db2777',
    description: 'بذل المال أو الجهد في سبيل الله.',
    virtues: 'الصدقة تطفئ غضب الرب.',
    tips: ['لو بالقليل الدائم'],
    instructions: ['أعط محتاجاً أو ساهم في مشروع خيري'],
    notes: 'نقطة واحدة.',
    pointsRule: 'fixed:1'
  }
];
