import { Unit, PupilPracticeRecord, PupilProfile } from '../types/curriculum';
import { DEFAULT_GLOBAL_SUCCESS_CURRICULUM } from '../data/defaultCurriculum';

const CURRICULUM_STORAGE_KEY = 'global_success_curriculum_v4';
const PRACTICE_RECORDS_KEY = 'global_success_practice_records_v1';
const PUPIL_PROFILE_KEY = 'global_success_pupil_profile_v1';
const INCLUSION_SETTINGS_KEY = 'global_success_inclusion_settings_v1';

export interface InclusionSettings {
  slowSpeech: boolean; // 🐢 Slow mode vs 🐇 Normal
  pictureSupport: boolean;
  vietnameseHints: boolean;
}

export function loadCurriculum(): Unit[] {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all 92 units are present (16 + 16 + 20 + 20 + 20) and contain enriched content
      const g3u1 = Array.isArray(parsed) && parsed.find((u: Unit) => u.id === 'g3-u1');
      const isEnriched = g3u1 && g3u1.lessons[0]?.vocabulary?.length >= 7 && g3u1.lessons[0]?.sentencePatterns?.length >= 3;
      if (Array.isArray(parsed) && parsed.length >= DEFAULT_GLOBAL_SUCCESS_CURRICULUM.length && isEnriched) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading curriculum from localStorage:', e);
  }
  // Save updated full curriculum
  saveCurriculum(DEFAULT_GLOBAL_SUCCESS_CURRICULUM);
  return DEFAULT_GLOBAL_SUCCESS_CURRICULUM;
}

export function saveCurriculum(curriculum: Unit[]): void {
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(curriculum));
  } catch (e) {
    console.error('Error saving curriculum to localStorage:', e);
  }
}

export function resetCurriculumToDefault(): Unit[] {
  try {
    localStorage.removeItem(CURRICULUM_STORAGE_KEY);
  } catch (e) {}
  return DEFAULT_GLOBAL_SUCCESS_CURRICULUM;
}

export function exportCurriculumAsJson(curriculum: Unit[]): void {
  const jsonStr = JSON.stringify(curriculum, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `global-success-curriculum-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadPracticeRecords(): PupilPracticeRecord[] {
  try {
    const raw = localStorage.getItem(PRACTICE_RECORDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading practice records:', e);
  }
  return [];
}

export function savePracticeRecord(record: PupilPracticeRecord): void {
  try {
    const existing = loadPracticeRecords();
    const updated = [record, ...existing].slice(0, 300); // keep last 300 records
    localStorage.setItem(PRACTICE_RECORDS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving practice record:', e);
  }
}

export function loadPupilProfile(): PupilProfile {
  try {
    const raw = localStorage.getItem(PUPIL_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading pupil profile:', e);
  }
  return {
    name: 'Bé Mai',
    avatar: '🐰',
    grade: 1,
    starsEarned: 12,
    wordsPracticedCount: 8,
    sentencesPracticedCount: 4,
    speakingSessionsCount: 2,
  };
}

export function savePupilProfile(profile: PupilProfile): void {
  try {
    localStorage.setItem(PUPIL_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving pupil profile:', e);
  }
}

export function loadInclusionSettings(): InclusionSettings {
  try {
    const raw = localStorage.getItem(INCLUSION_SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading inclusion settings:', e);
  }
  return {
    slowSpeech: false,
    pictureSupport: true,
    vietnameseHints: true,
  };
}

export function saveInclusionSettings(settings: InclusionSettings): void {
  try {
    localStorage.setItem(INCLUSION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving inclusion settings:', e);
  }
}
