export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  vietnamese: string;
  imageEmojiOrUrl: string;
  soundPhonics?: string; // e.g. "b", "c", "æ"
  exampleSentence?: string;
  teacherTips?: string;
}

export interface SentencePatternItem {
  id: string;
  english: string;
  ipa?: string;
  vietnamese: string;
  dialogueExchange?: {
    prompt: string;
    response: string;
  };
  focusStructure: string;
}

export interface SpeakingPromptItem {
  id: string;
  title: string;
  question: string;
  expectedAnswer: string;
  scaffoldHints: string[];
  visualSupportEmoji?: string;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePatternItem[];
  speakingActivities: SpeakingPromptItem[];
}

export interface Unit {
  id: string;
  grade: GradeLevel;
  unitNumber: number;
  title: string;
  topic: string;
  icon: string;
  lessons: Lesson[];
}

export interface FormativeEvaluation {
  pronunciationScore: number; // 1-5
  stressScore: number; // 1-5
  clarityScore: number; // 1-5
  intelligibilityScore: number; // 1-5
  overallLevel: string; // e.g. "Level 4 – Good"
  praiseComment: string;
  vietnamesePraise: string;
  focusSoundOrTip: string;
  formativeFeedback: {
    whatDidWell: string;
    whatToImprove: string;
    whatToTryNext: string;
  };
  teacherNotes: string;
}

export interface SpeakingAssessment {
  pronunciationLevel: number; // 1-5
  vocabularyLevel: number; // 1-5
  languageUseLevel: number; // 1-5
  communicationLevel: number; // 1-5
  overallLevel: string;
  whatDidWell: string;
  whatToImprove: string;
  whatToTryNext: string;
}

export interface PupilPracticeRecord {
  id: string;
  pupilName: string;
  grade: GradeLevel;
  unitNumber: number;
  unitTitle: string;
  activityType: 'vocabulary' | 'sentence' | 'speaking';
  targetText: string;
  overallLevel: string;
  pronunciationScore: number;
  date: string;
  attempts: number;
}

export interface PupilProfile {
  name: string;
  avatar: string; // emoji or avatar id
  grade: GradeLevel;
  starsEarned: number;
  wordsPracticedCount: number;
  sentencesPracticedCount: number;
  speakingSessionsCount: number;
}
