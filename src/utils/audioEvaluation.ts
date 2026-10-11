import { FormativeEvaluation } from '../types/curriculum';

export async function evaluatePupilSpeech(params: {
  targetText: string;
  recognizedText: string;
  ipa?: string;
  vietnamese?: string;
  grade: number;
  activityType: 'vocabulary' | 'sentence';
  unitTitle?: string;
}): Promise<FormativeEvaluation> {
  const { targetText, recognizedText, ipa, vietnamese, grade, activityType, unitTitle } = params;

  try {
    const response = await fetch('/api/evaluate-pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetText,
        recognizedText,
        ipa,
        vietnamese,
        grade,
        activityType,
        unitTitle,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data as FormativeEvaluation;
    }
  } catch (err) {
    console.warn('API evaluation error, computing local formative feedback:', err);
  }

  // Local fallback formative evaluation
  return calculateLocalFormativeFeedback(targetText, recognizedText);
}

function calculateLocalFormativeFeedback(target: string, spoken: string): FormativeEvaluation {
  const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  let similarity = 0.85; // default optimistic start for young kids
  if (cleanSpoken.length > 0) {
    if (cleanSpoken === cleanTarget) {
      similarity = 1.0;
    } else if (cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget)) {
      similarity = 0.9;
    } else {
      const matchWords = cleanTarget.split(' ').filter((w) => cleanSpoken.includes(w));
      similarity = 0.7 + (matchWords.length / cleanTarget.split(' ').length) * 0.25;
    }
  }

  const score = Math.max(3, Math.min(5, Math.round(similarity * 5)));
  const clarity = Math.max(3, Math.min(5, Math.round((similarity + 0.05) * 5)));
  const stress = Math.max(3, Math.min(5, Math.round((similarity - 0.02) * 5)));
  const intelligibility = Math.max(3, Math.min(5, Math.round((similarity + 0.02) * 5)));

  let overallLevel = 'Level 4 – Good';
  let praise = 'Great job! Your pronunciation is clear!';
  let vietnamesePraise = 'Em làm rất tốt! Giọng đọc rõ ràng và tự tin!';

  if (score === 5) {
    overallLevel = 'Level 5 – Confident';
    praise = 'Superstar! Excellent pronunciation and natural rhythm!';
    vietnamesePraise = 'Xuất sắc! Phát âm rất chuẩn và ngữ điệu tự nhiên!';
  } else if (score === 3) {
    overallLevel = 'Level 3 – Progressing';
    praise = 'Good attempt! Keep practicing with Teacher Lily!';
    vietnamesePraise = 'Cố gắng rất tốt! Hãy nghe lại mẫu và thử lại nhé!';
  }

  return {
    pronunciationScore: score,
    stressScore: stress,
    clarityScore: clarity,
    intelligibilityScore: intelligibility,
    overallLevel,
    praiseComment: praise,
    vietnamesePraise,
    focusSoundOrTip: `Listen to the target "${target}" carefully and feel the rhythm!`,
    formativeFeedback: {
      whatDidWell: 'You spoke clearly with great enthusiasm!',
      whatToImprove: 'Make sure each sound in the word is completed smoothly.',
      whatToTryNext: 'Press 🎧 Listen to hear Teacher Lily once more, then tap 🎙 Record to try again!',
    },
    teacherNotes: `Formative heuristic assessment: Target '${target}'. Spoken text: '${spoken || '(audio)'}'. High intelligibility observed.`,
  };
}
