import React, { useState, useRef, useEffect } from 'react';
import { Unit, VocabularyItem, FormativeEvaluation, PupilProfile, GradeLevel } from '../types/curriculum';
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
  BookOpen,
} from 'lucide-react';

interface VocabularyPracticeProps {
  unit: Unit;
  grade: GradeLevel;
  onBackToUnit: () => void;
  inclusionSettings: InclusionSettings;
  pupilProfile: PupilProfile;
  onUpdatePupilProfile: (newProfile: PupilProfile) => void;
  onAskAssistant?: (word: string, vietnamese: string) => void;
}

export const VocabularyPractice: React.FC<VocabularyPracticeProps> = ({
  unit,
  grade,
  onBackToUnit,
  inclusionSettings,
  pupilProfile,
  onUpdatePupilProfile,
  onAskAssistant,
}) => {
  // Aggregate vocabulary from all lessons in this unit
  const allVocab: VocabularyItem[] = unit.lessons.flatMap((l) => l.vocabulary);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem: VocabularyItem | undefined = allVocab[currentIndex];

  const [isModelPlaying, setIsModelPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<FormativeEvaluation | null>(null);
  const [attempts, setAttempts] = useState(1);
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);

  const recorderRef = useRef<PupilAudioRecorder | null>(null);
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on word change
  useEffect(() => {
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setAttempts(1);
    setIsRecording(false);
    setIsReplaying(false);
  }, [currentIndex]);

  if (!currentItem) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-600">Chưa có từ vựng trong bài này.</p>
        <button
          onClick={onBackToUnit}
          className="mt-4 px-4 py-2 bg-amber-500 text-white font-bold rounded-xl"
        >
          Quay lại Unit
        </button>
      </div>
    );
  }

  // Model audio playback
  const handlePlayModelAudio = async (slowSpeed = false) => {
    if (isModelPlaying) return;
    setIsModelPlaying(true);
    try {
      await playTextToSpeech(currentItem.word, {
        slow: slowSpeed || inclusionSettings.slowSpeech,
      });
    } finally {
      setIsModelPlaying(false);
    }
  };

  // Start Pupil Recording
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
      alert('Vui lòng cấp quyền micro trên trình duyệt để ghi âm giọng nói của em nhé!');
    }
  };

  // Stop Recording & Auto Evaluate
  const handleStopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;
    setIsRecording(false);
    setIsEvaluating(true);

    const result = await recorderRef.current.stopRecording();
    setRecordedAudioUrl(result.audioUrl);

    // Call formative evaluation
    const evalResult = await evaluatePupilSpeech({
      targetText: currentItem.word,
      recognizedText: result.transcript,
      ipa: currentItem.ipa,
      vietnamese: currentItem.vietnamese,
      grade,
      activityType: 'vocabulary',
      unitTitle: unit.title,
    });

    setEvaluation(evalResult);
    setIsEvaluating(false);

    // Update pupil profile & save record
    const starsToAdd = Math.max(1, evalResult.pronunciationScore);
    onUpdatePupilProfile({
      ...pupilProfile,
      starsEarned: pupilProfile.starsEarned + starsToAdd,
      wordsPracticedCount: pupilProfile.wordsPracticedCount + 1,
    });

    savePracticeRecord({
      id: `rec-${Date.now()}`,
      pupilName: pupilProfile.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      activityType: 'vocabulary',
      targetText: currentItem.word,
      overallLevel: evalResult.overallLevel,
      pronunciationScore: evalResult.pronunciationScore,
      date: new Date().toLocaleDateString('vi-VN'),
      attempts,
    });
  };

  // Replay pupil's own recorded voice
  const handleReplayPupilAudio = () => {
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

  // Try again
  const handleTryAgain = () => {
    setEvaluation(null);
    setRecordedAudioUrl(null);
    setAttempts((prev) => prev + 1);
    handlePlayModelAudio(inclusionSettings.slowSpeech);
  };

  const handleNextWord = () => {
    if (currentIndex < allVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToUnit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách Unit</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-amber-700 uppercase">
            Unit {unit.unitNumber} • Luyện Từ Vựng
          </span>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">
            Từ {currentIndex + 1} / {allVocab.length}
          </div>
        </div>

        {/* Word Counter Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevWord}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            title="Từ trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextWord}
            disabled={currentIndex === allVocab.length - 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            title="Từ tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flashcard for Vocabulary Practice */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-6 sm:p-10 shadow-md relative overflow-hidden mb-6">
        {/* Top Phonics Badge if available */}
        {currentItem.soundPhonics && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Âm trọng tâm: /{currentItem.soundPhonics}/</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Illustration */}
          {inclusionSettings.pictureSupport && (
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-amber-50/80 border-2 border-amber-200 flex items-center justify-center text-7xl sm:text-8xl shadow-inner shrink-0 select-none">
              {currentItem.imageEmojiOrUrl.startsWith('http') ? (
                <img
                  src={currentItem.imageEmojiOrUrl}
                  alt={currentItem.word}
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <span>{currentItem.imageEmojiOrUrl || '🌟'}</span>
              )}
            </div>
          )}

          {/* Center: English Word, IPA, Vietnamese meaning */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                {currentItem.word}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="font-mono text-base sm:text-lg font-semibold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-200">
                  {currentItem.ipa}
                </span>
              </div>
            </div>

            {/* Vietnamese Meaning (Accessible support) */}
            {inclusionSettings.vietnameseHints && (
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                Nghĩa: <span className="font-bold text-slate-800">{currentItem.vietnamese}</span>
              </p>
            )}

            {/* Example sentence */}
            {currentItem.exampleSentence && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 inline-block">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Mẫu câu ví dụ
                </p>
                <p className="text-sm font-bold text-slate-800 italic">
                  "{currentItem.exampleSentence}"
                </p>
              </div>
            )}

            {/* Ask AI Teacher Button */}
            {onAskAssistant && (
              <div className="pt-1">
                <button
                  onClick={() =>
                    onAskAssistant(
                      currentItem.word,
                      `Nghĩa của từ "${currentItem.word}" là gì, cách phát âm và lý do sử dụng từ này trong câu như thế nào?`
                    )
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm transition active:scale-95 shadow-2xs"
                  title="Hỏi cô giáo trợ lý AI giải thích nghĩa, phát âm và cách dùng từ này"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hỏi Cô Giáo về từ này 💡</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Interactive Audio Controls (User requirement: Listen, Record, Replay, Try Again) */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* 🎧 Listen Model */}
          <button
            onClick={() => handlePlayModelAudio(false)}
            disabled={isModelPlaying || isRecording}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-sm transition active:scale-95 ${
              isModelPlaying
                ? 'bg-amber-300 text-amber-950 animate-pulse'
                : 'bg-amber-400 hover:bg-amber-500 text-amber-950'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>🎧 {isModelPlaying ? 'Đang đọc...' : 'Nghe cô đọc'}</span>
          </button>

          {/* Slow Listen Model (0.75x) */}
          <button
            onClick={() => handlePlayModelAudio(true)}
            disabled={isModelPlaying || isRecording}
            className="flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition"
            title="Nghe chậm tốc độ 0.75x"
          >
            <span>🐢 Nghe chậm</span>
          </button>

          {/* 🎙 Record / Stop Recording */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isModelPlaying || isEvaluating}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base shadow-md transition active:scale-95 animate-bounce-short"
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
              <span>Dừng & Chấm điểm</span>
            </button>
          )}

          {/* ▶ Replay recorded voice */}
          {recordedAudioUrl && (
            <button
              onClick={handleReplayPupilAudio}
              disabled={isRecording || isReplaying}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition active:scale-95 ${
                isReplaying
                  ? 'bg-sky-200 text-sky-950 border-sky-400 animate-pulse'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-300'
              }`}
            >
              <Play className="w-5 h-5 fill-current text-sky-600" />
              <span>▶ Nghe giọng em</span>
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

        {/* Live Audio Visualizer Bar when Recording */}
        {isRecording && (
          <div className="mt-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <p className="text-xs font-bold text-rose-800 mb-2 animate-pulse">
              Đang lắng nghe em nói: "{currentItem.word}"... Hãy phát âm to và rõ nhé!
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
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center animate-pulse">
            <p className="text-sm font-bold text-amber-900">
              Cô giáo AI Teacher Lily đang lắng nghe và đánh giá phát âm của em... 🌟
            </p>
          </div>
        )}
      </div>

      {/* Formative Feedback Card (When evaluated) */}
      {evaluation && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300/80 p-6 sm:p-8 shadow-lg mb-8">
          {/* Header of Feedback: Stars & Child Praise */}
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

            {/* Stars visual display */}
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

          {/* Formative 4 Dimensions Evaluation */}
          <div className="my-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Chỉ số phát âm từng khía cạnh (Đánh giá quá trình)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Độ rõ ràng</span>
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
                <span className="text-xs text-slate-500 font-medium">Trọng âm</span>
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
                <span className="text-xs text-slate-500 font-medium">Phát âm âm tiết</span>
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

          {/* Simple Improvement Suggestion for young learners */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Gợi ý cho em
              </p>
              <p className="text-sm font-semibold text-amber-950 mt-0.5">
                {evaluation.focusSoundOrTip}
              </p>
            </div>
          </div>

          {/* Competency-based 3 feedback questions */}
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

          {/* Detailed Teacher Assessment Panel toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowTeacherPanel(!showTeacherPanel)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showTeacherPanel ? 'Ẩn sổ tay Giáo viên' : 'Xem chẩn đoán chi tiết cho Giáo viên'}</span>
            </button>

            {currentIndex < allVocab.length - 1 && (
              <button
                onClick={handleNextWord}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 text-xs sm:text-sm rounded-xl transition inline-flex items-center gap-1.5"
              >
                <span>Học từ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {showTeacherPanel && (
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed font-sans">
              <p className="font-bold text-indigo-900 mb-1">
                Ghi chú sư phạm dành cho Giáo viên (Teacher Diagnostic Notes):
              </p>
              <p>{evaluation.teacherNotes}</p>
              {currentItem.teacherTips && (
                <p className="mt-2 pt-2 border-t border-indigo-200/60 text-slate-700">
                  <span className="font-semibold">Mẹo hướng dẫn ngữ âm: </span>
                  {currentItem.teacherTips}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
