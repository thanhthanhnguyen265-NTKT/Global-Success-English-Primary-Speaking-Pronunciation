import React, { useState, useRef, useEffect } from 'react';
import { Unit, SentencePatternItem, FormativeEvaluation, PupilProfile, GradeLevel } from '../types/curriculum';
import { playTextToSpeech, PupilAudioRecorder } from '../utils/speech';
import { evaluatePupilSpeech } from '../utils/audioEvaluation';
import { InclusionSettings, savePracticeRecord } from '../utils/storage';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Square,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Award,
  MessageCircle,
} from 'lucide-react';

interface SentencePracticeProps {
  unit: Unit;
  grade: GradeLevel;
  onBackToUnit: () => void;
  inclusionSettings: InclusionSettings;
  pupilProfile: PupilProfile;
  onUpdatePupilProfile: (newProfile: PupilProfile) => void;
  onAskAssistant?: (sentence: string, question: string) => void;
}

export const SentencePractice: React.FC<SentencePracticeProps> = ({
  unit,
  grade,
  onBackToUnit,
  inclusionSettings,
  pupilProfile,
  onUpdatePupilProfile,
  onAskAssistant,
}) => {
  const allPatterns: SentencePatternItem[] = unit.lessons.flatMap(
    (l) => l.sentencePatterns
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPattern: SentencePatternItem | undefined = allPatterns[currentIndex];

  const [isModelPlaying, setIsModelPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<FormativeEvaluation | null>(null);
  const [attempts, setAttempts] = useState(1);
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);

  const recorderRef = useRef<PupilAudioRecorder | null>(null);
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setAttempts(1);
    setIsRecording(false);
    setIsReplaying(false);
  }, [currentIndex]);

  if (!currentPattern) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-600">Chưa có mẫu câu trong bài này.</p>
        <button
          onClick={onBackToUnit}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl"
        >
          Quay lại Unit
        </button>
      </div>
    );
  }

  // Target sentence to speak
  const targetEnglishToSpeak = currentPattern.dialogueExchange
    ? currentPattern.dialogueExchange.response
    : currentPattern.english;

  const handlePlayModel = async (slowSpeed = false) => {
    if (isModelPlaying) return;
    setIsModelPlaying(true);
    try {
      await playTextToSpeech(targetEnglishToSpeak, {
        slow: slowSpeed || inclusionSettings.slowSpeech,
      });
    } finally {
      setIsModelPlaying(false);
    }
  };

  const handlePlayFullDialogue = async () => {
    if (isModelPlaying || !currentPattern.dialogueExchange) return;
    setIsModelPlaying(true);
    try {
      await playTextToSpeech(currentPattern.dialogueExchange.prompt, {
        slow: inclusionSettings.slowSpeech,
      });
      await new Promise((r) => setTimeout(r, 600));
      await playTextToSpeech(currentPattern.dialogueExchange.response, {
        slow: inclusionSettings.slowSpeech,
      });
    } finally {
      setIsModelPlaying(false);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    setEvaluation(null);
    setRecordedAudioUrl(null);

    const recorder = new PupilAudioRecorder();
    recorderRef.current = recorder;

    const started = await recorder.startRecording((volume) => {
      setAudioVolume(volume);
    });

    if (started) {
      setIsRecording(true);
    } else {
      alert('Vui lòng cấp quyền micro để ghi âm mẫu câu nhé!');
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;
    setIsRecording(false);
    setIsEvaluating(true);

    const result = await recorderRef.current.stopRecording();
    setRecordedAudioUrl(result.audioUrl);

    // Call formative evaluation
    const evalResult = await evaluatePupilSpeech({
      targetText: targetEnglishToSpeak,
      recognizedText: result.transcript,
      ipa: currentPattern.ipa,
      vietnamese: currentPattern.vietnamese,
      grade,
      activityType: 'sentence',
      unitTitle: unit.title,
    });

    setEvaluation(evalResult);
    setIsEvaluating(false);

    // Update pupil profile & save record
    const starsToAdd = Math.max(1, evalResult.pronunciationScore);
    onUpdatePupilProfile({
      ...pupilProfile,
      starsEarned: pupilProfile.starsEarned + starsToAdd,
      sentencesPracticedCount: pupilProfile.sentencesPracticedCount + 1,
    });

    savePracticeRecord({
      id: `rec-${Date.now()}`,
      pupilName: pupilProfile.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      activityType: 'sentence',
      targetText: targetEnglishToSpeak,
      overallLevel: evalResult.overallLevel,
      pronunciationScore: evalResult.pronunciationScore,
      date: new Date().toLocaleDateString('vi-VN'),
      attempts,
    });
  };

  const handleReplay = () => {
    if (!recordedAudioUrl) return;
    if (replayAudioRef.current) {
      replayAudioRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    replayAudioRef.current = audio;
    setIsReplaying(true);
    audio.onended = () => setIsReplaying(false);
    audio.onerror = () => setIsReplaying(false);
    audio.play();
  };

  const handleTryAgain = () => {
    setEvaluation(null);
    setRecordedAudioUrl(null);
    setAttempts((prev) => prev + 1);
    handlePlayModel(inclusionSettings.slowSpeech);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToUnit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách Unit</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-emerald-700 uppercase">
            Unit {unit.unitNumber} • Luyện Mẫu Câu
          </span>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">
            Mẫu câu {currentIndex + 1} / {allPatterns.length}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            title="Mẫu câu trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              currentIndex < allPatterns.length - 1 &&
              setCurrentIndex(currentIndex + 1)
            }
            disabled={currentIndex === allPatterns.length - 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            title="Mẫu câu tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sentence Card */}
      <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-10 shadow-md relative overflow-hidden mb-6">
        {/* Grammatical Structure tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-4">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Cấu trúc ngữ pháp: {currentPattern.focusStructure}</span>
        </div>

        {/* Dialogue context if present */}
        {currentPattern.dialogueExchange ? (
          <div className="space-y-4 mb-6">
            {/* Person A / Teacher */}
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-lg shrink-0">
                👩‍🏫
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Cô giáo / Người hỏi
                </span>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {currentPattern.dialogueExchange.prompt}
                </p>
              </div>
            </div>

            {/* Person B / Pupil target */}
            <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-300 p-4 sm:p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-lg shrink-0">
                🧒
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    Em nói theo mẫu này:
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Mục tiêu chính
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {currentPattern.dialogueExchange.response}
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 mb-6">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {currentPattern.english}
            </h3>
          </div>
        )}

        {/* Optional IPA & Vietnamese Support */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          {currentPattern.ipa && (
            <div className="font-mono text-sm sm:text-base font-semibold text-emerald-800">
              {currentPattern.ipa}
            </div>
          )}
          {inclusionSettings.vietnameseHints && (
            <div className="text-xs sm:text-sm text-slate-700 font-medium">
              <span className="font-bold">Nghĩa tiếng Việt: </span>
              {currentPattern.vietnamese}
            </div>
          )}

          {/* Ask AI Teacher Button */}
          {onAskAssistant && (
            <div className="w-full pt-1 flex justify-end">
              <button
                onClick={() =>
                  onAskAssistant(
                    currentPattern.english,
                    `Giải thích vì sao mẫu câu "${currentPattern.english}" lại dùng cấu trúc "${currentPattern.focusStructure}" và cách sử dụng câu này như thế nào?`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition active:scale-95 shadow-2xs"
                title="Hỏi cô giáo trợ lý AI giải thích vì sao dùng cấu trúc này"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vì sao câu này dùng như vậy? 💡</span>
              </button>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* 🎧 Listen Model */}
          <button
            onClick={() => handlePlayModel(false)}
            disabled={isModelPlaying || isRecording}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-sm transition active:scale-95 ${
              isModelPlaying
                ? 'bg-emerald-300 text-emerald-950 animate-pulse'
                : 'bg-emerald-400 hover:bg-emerald-500 text-emerald-950'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>🎧 {isModelPlaying ? 'Đang đọc...' : 'Nghe mẫu'}</span>
          </button>

          {/* Slow Speech Button */}
          <button
            onClick={() => handlePlayModel(true)}
            disabled={isModelPlaying || isRecording}
            className="flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm transition"
            title="Nghe chậm nhịp điệu câu"
          >
            <span>🐢 Nghe chậm</span>
          </button>

          {/* If dialogue, button to hear both */}
          {currentPattern.dialogueExchange && (
            <button
              onClick={handlePlayFullDialogue}
              disabled={isModelPlaying || isRecording}
              className="flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition"
              title="Nghe trọn vẹn cả câu hỏi và trả lời"
            >
              <span>💬 Nghe cả đoạn</span>
            </button>
          )}

          {/* 🎙 Record / Stop */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isModelPlaying || isEvaluating}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base shadow-md transition active:scale-95"
            >
              <Mic className="w-5 h-5" />
              <span>🎙 Bấm để nói</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm sm:text-base shadow-lg transition active:scale-95 ring-4 ring-rose-200 animate-pulse"
            >
              <Square className="w-5 h-5 fill-current text-rose-400" />
              <span>Dừng & Chấm câu</span>
            </button>
          )}

          {/* ▶ Replay recorded voice */}
          {recordedAudioUrl && (
            <button
              onClick={handleReplay}
              disabled={isRecording || isReplaying}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition active:scale-95 ${
                isReplaying
                  ? 'bg-sky-200 text-sky-950 border-sky-400 animate-pulse'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-300'
              }`}
            >
              <Play className="w-5 h-5 fill-current text-sky-600" />
              <span>▶ Nghe lại câu của em</span>
            </button>
          )}

          {/* 🔄 Try Again */}
          {evaluation && (
            <button
              onClick={handleTryAgain}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔄 Thử lại (Lần {attempts + 1})</span>
            </button>
          )}
        </div>

        {isRecording && (
          <div className="mt-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <p className="text-xs font-bold text-rose-800 mb-2 animate-pulse">
              Đang lắng nghe em nói câu: "{targetEnglishToSpeak}"...
            </p>
            <div className="w-full bg-rose-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-75 rounded-full"
                style={{ width: `${Math.max(10, Math.min(100, audioVolume))}%` }}
              />
            </div>
          </div>
        )}

        {isEvaluating && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-pulse">
            <p className="text-sm font-bold text-emerald-900">
              Cô giáo AI Teacher Lily đang đánh giá nhịp điệu và độ trôi chảy của câu... 🌟
            </p>
          </div>
        )}
      </div>

      {/* Formative Evaluation Result for Sentence Pattern */}
      {evaluation && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300/80 p-6 sm:p-8 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl">
                {evaluation.pronunciationScore >= 4 ? '🎉' : '👏'}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 mb-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{evaluation.overallLevel}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {evaluation.praiseComment}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                  {evaluation.vietnamesePraise}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-2xl ${
                    s <= evaluation.pronunciationScore
                      ? 'text-amber-400'
                      : 'text-slate-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Formative Dimension Metrics: Pronunciation, Stress, Rhythm & Intelligibility */}
          <div className="my-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Đánh giá năng lực nói câu (Phát âm, Trọng âm, Nhịp điệu, Độ trọn vẹn)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Phát âm câu</span>
                <div className="text-lg font-black text-slate-800 mt-1">
                  {evaluation.pronunciationScore} / 5
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(evaluation.pronunciationScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Trọng âm từ chính</span>
                <div className="text-lg font-black text-slate-800 mt-1">
                  {evaluation.stressScore} / 5
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(evaluation.stressScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Nhịp điệu câu</span>
                <div className="text-lg font-black text-slate-800 mt-1">
                  {evaluation.clarityScore} / 5
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(evaluation.clarityScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Độ dễ hiểu</span>
                <div className="text-lg font-black text-slate-800 mt-1">
                  {evaluation.intelligibilityScore} / 5
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(evaluation.intelligibilityScore / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3 Formative questions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900">
                🌟 Em làm tốt điều gì?
              </span>
              <p className="text-xs sm:text-sm text-emerald-950 mt-1 font-medium">
                {evaluation.formativeFeedback.whatDidWell}
              </p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900">
                🌱 Điểm có thể rèn thêm
              </span>
              <p className="text-xs sm:text-sm text-amber-950 mt-1 font-medium">
                {evaluation.formativeFeedback.whatToImprove}
              </p>
            </div>
            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
              <span className="text-xs font-bold text-sky-900">
                🚀 Thử thách tiếp theo
              </span>
              <p className="text-xs sm:text-sm text-sky-950 mt-1 font-medium">
                {evaluation.formativeFeedback.whatToTryNext}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowTeacherNotes(!showTeacherNotes)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showTeacherNotes ? 'Ẩn nhận xét Sư phạm' : 'Xem nhận xét Sư phạm cho Giáo viên'}</span>
            </button>

            {currentIndex < allPatterns.length - 1 && (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-xs sm:text-sm rounded-xl transition inline-flex items-center gap-1.5"
              >
                <span>Mẫu câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {showTeacherNotes && (
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed font-sans">
              <p className="font-bold text-indigo-900 mb-1">
                Ghi chú ngữ điệu câu (Intonation & Stress Analysis):
              </p>
              <p>{evaluation.teacherNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
