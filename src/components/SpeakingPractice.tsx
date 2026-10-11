import React, { useState, useRef, useEffect } from 'react';
import {
  Unit,
  SpeakingPromptItem,
  SpeakingAssessment,
  PupilProfile,
  GradeLevel,
} from '../types/curriculum';
import { playTextToSpeech, PupilAudioRecorder } from '../utils/speech';
import { InclusionSettings, savePracticeRecord } from '../utils/storage';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
  CheckCircle2,
  MessageSquare,
  Smile,
} from 'lucide-react';

interface SpeakingPracticeProps {
  unit: Unit;
  grade: GradeLevel;
  onBackToUnit: () => void;
  inclusionSettings: InclusionSettings;
  pupilProfile: PupilProfile;
  onUpdatePupilProfile: (newProfile: PupilProfile) => void;
}

interface ChatMessage {
  id: string;
  sender: 'teacher' | 'pupil';
  text: string;
  vietnameseSupport?: string;
  audioUrl?: string;
  timestamp: string;
}

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  unit,
  grade,
  onBackToUnit,
  inclusionSettings,
  pupilProfile,
  onUpdatePupilProfile,
}) => {
  // Initial prompt from unit's lessons
  const initialPromptItem = unit.lessons[0]?.speakingActivities[0];
  const targetVocab = unit.lessons.flatMap((l) => l.vocabulary.map((v) => v.word));
  const targetPattern = unit.lessons[0]?.sentencePatterns[0]?.english;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [maxTurns] = useState(4);
  const [suggestedScaffolds, setSuggestedScaffolds] = useState<string[]>([]);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalAssessment, setFinalAssessment] = useState<SpeakingAssessment | null>(null);

  const recorderRef = useRef<PupilAudioRecorder | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize dialogue with Teacher Lily's first greeting
  useEffect(() => {
    const greetingText = initialPromptItem
      ? initialPromptItem.question
      : `Hello! I am Teacher Lily. Welcome to Unit ${unit.unitNumber}! What is your name?`;

    const initialMessage: ChatMessage = {
      id: 'msg-init',
      sender: 'teacher',
      text: greetingText,
      vietnameseSupport:
        'Xin chào em! Cô là cô giáo Lily. Tên của em là gì nào?',
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([initialMessage]);
    setSuggestedScaffolds(
      initialPromptItem?.scaffoldHints || [
        `Hi Teacher Lily! My name is ${pupilProfile.name}.`,
        `Hello Teacher!`,
        `I am ${pupilProfile.name}.`,
      ]
    );

    // Speak initial greeting
    playTextToSpeech(greetingText, { slow: inclusionSettings.slowSpeech });
  }, [unit]);

  // Speak a message aloud
  const handleSpeakText = async (text: string) => {
    if (isTeacherSpeaking) return;
    setIsTeacherSpeaking(true);
    try {
      await playTextToSpeech(text, { slow: inclusionSettings.slowSpeech });
    } finally {
      setIsTeacherSpeaking(false);
    }
  };

  // Start pupil recording
  const handleStartRecording = async () => {
    if (isRecording || isThinking) return;
    const recorder = new PupilAudioRecorder();
    recorderRef.current = recorder;

    const started = await recorder.startRecording((volume) => {
      setAudioVolume(volume);
    });

    if (started) {
      setIsRecording(true);
    } else {
      alert('Vui lòng cấp quyền micro để nói chuyện cùng Cô Lily nhé!');
    }
  };

  // Stop recording and send pupil's voice turn
  const handleStopRecording = async (presetText?: string) => {
    let spokenText = presetText;
    let audioUrl = '';

    if (!presetText && recorderRef.current && isRecording) {
      setIsRecording(false);
      const res = await recorderRef.current.stopRecording();
      spokenText = res.transcript || 'Hello teacher!';
      audioUrl = res.audioUrl;
    } else if (isRecording) {
      setIsRecording(false);
      await recorderRef.current?.stopRecording();
    }

    if (!spokenText) return;

    // Add pupil message
    const pupilMsg: ChatMessage = {
      id: `pupil-${Date.now()}`,
      sender: 'pupil',
      text: spokenText,
      audioUrl,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const nextMessages = [...messages, pupilMsg];
    setMessages(nextMessages);
    setIsThinking(true);

    try {
      const response = await fetch('/api/speaking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          unitNumber: unit.unitNumber,
          unitTitle: unit.title,
          unitTopic: unit.topic,
          targetSentence: targetPattern,
          targetVocab,
          history: nextMessages.map((m) => ({
            role: m.sender === 'teacher' ? 'model' : 'user',
            text: m.text,
          })),
          pupilSpeech: spokenText,
          turnCount: currentTurn,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const teacherMsg: ChatMessage = {
          id: `teacher-${Date.now()}`,
          sender: 'teacher',
          text: data.teacherReply,
          vietnameseSupport: data.vietnameseSupport,
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [...prev, teacherMsg]);
        setSuggestedScaffolds(data.suggestedScaffolds || []);

        // Speak teacher reply
        playTextToSpeech(data.teacherReply, { slow: inclusionSettings.slowSpeech });

        if (data.assessment) {
          setFinalAssessment(data.assessment);
        }

        if (currentTurn >= maxTurns || data.isCompleted) {
          setIsCompleted(true);
          // Reward stars
          onUpdatePupilProfile({
            ...pupilProfile,
            starsEarned: pupilProfile.starsEarned + 5,
            speakingSessionsCount: pupilProfile.speakingSessionsCount + 1,
          });

          savePracticeRecord({
            id: `rec-spk-${Date.now()}`,
            pupilName: pupilProfile.name,
            grade,
            unitNumber: unit.unitNumber,
            unitTitle: unit.title,
            activityType: 'speaking',
            targetText: `Conversation: ${unit.topic}`,
            overallLevel: data.assessment?.overallLevel || 'Level 4 – Good',
            pronunciationScore: data.assessment?.pronunciationLevel || 4,
            date: new Date().toLocaleDateString('vi-VN'),
            attempts: currentTurn,
          });
        } else {
          setCurrentTurn((prev) => prev + 1);
        }
      }
    } catch (e) {
      console.error('Speaking chat error:', e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRestartDialogue = () => {
    setCurrentTurn(1);
    setIsCompleted(false);
    setFinalAssessment(null);
    const greetingText = initialPromptItem
      ? initialPromptItem.question
      : `Hello! I am Teacher Lily. Let's talk together!`;

    const initialMessage: ChatMessage = {
      id: `msg-restart-${Date.now()}`,
      sender: 'teacher',
      text: greetingText,
      vietnameseSupport: 'Xin chào em! Cùng nói chuyện lại từ đầu nhé!',
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages([initialMessage]);
    playTextToSpeech(greetingText, { slow: inclusionSettings.slowSpeech });
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-200/60">
        <button
          onClick={onBackToUnit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách Unit</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-xl shadow-xs">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900">
                Cô giáo AI: Teacher Lily
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                Lượt {Math.min(currentTurn, maxTurns)} / {maxTurns}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Chủ đề: {unit.topic}
            </p>
          </div>
        </div>

        <button
          onClick={handleRestartDialogue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          title="Bắt đầu cuộc trò chuyện mới"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Làm lại</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="bg-amber-50/40 rounded-3xl border border-amber-200/80 p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 mb-6 shadow-inner">
        {messages.map((msg) => {
          const isTeacher = msg.sender === 'teacher';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isTeacher ? 'justify-start' : 'justify-end'
              }`}
            >
              {isTeacher && (
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shrink-0 shadow-xs border border-amber-300">
                  👩‍🏫
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[70%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  isTeacher
                    ? 'bg-white text-slate-900 border border-amber-200/90 rounded-tl-sm'
                    : 'bg-emerald-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isTeacher ? 'text-amber-800' : 'text-emerald-100'
                    }`}
                  >
                    {isTeacher ? 'Teacher Lily' : pupilProfile.name}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isTeacher ? 'text-slate-400' : 'text-emerald-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold leading-relaxed">
                  {msg.text}
                </p>

                {/* Vietnamese Support Translation */}
                {isTeacher &&
                  msg.vietnameseSupport &&
                  inclusionSettings.vietnameseHints && (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
                      💡 {msg.vietnameseSupport}
                    </p>
                  )}

                {/* Audio controls in bubble */}
                <div className="mt-3 flex items-center gap-2">
                  {isTeacher ? (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      disabled={isTeacherSpeaking}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe cô đọc lại</span>
                    </button>
                  ) : (
                    msg.audioUrl && (
                      <button
                        onClick={() => {
                          const a = new Audio(msg.audioUrl);
                          a.play();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-emerald-50 text-xs font-bold transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Nghe lại giọng em</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {!isTeacher && (
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-xl shrink-0 shadow-xs border border-emerald-300">
                  {pupilProfile.avatar}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs animate-bounce">
              👩‍🏫
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2.5 shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>Cô Lily đang phản hồi ngay...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Scaffolding Hints for Primary Mixed Ability */}
      {!isCompleted && suggestedScaffolds.length > 0 && (
        <div className="mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <span>Gợi ý câu trả lời (Em có thể bấm hoặc nói theo mẫu này):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedScaffolds.map((hint, idx) => (
              <button
                key={idx}
                onClick={() => handleStopRecording(hint)}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs sm:text-sm font-semibold text-sky-900 transition active:scale-95"
              >
                💬 "{hint}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pupil Speech Input Controls */}
      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Đến lượt em trả lời Cô Lily rồi đó!
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Bấm vào chiếc micro màu đỏ và trả lời to, rõ ràng nhé!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                disabled={isThinking}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base shadow-md transition active:scale-95 animate-bounce-short"
              >
                <Mic className="w-5 h-5" />
                <span>🎙 Bấm để nói</span>
              </button>
            ) : (
              <button
                onClick={() => handleStopRecording()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm sm:text-base shadow-lg transition active:scale-95 ring-4 ring-rose-200 animate-pulse"
              >
                <Square className="w-5 h-5 fill-current text-rose-400" />
                <span>Dừng & Gửi cho Cô</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Dialogue Completed Celebration Card */
        <div className="bg-white rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-lg text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-4xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            🎉
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
            Hoàn thành xuất sắc buổi giao tiếp!
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            Tuyệt vời lắm, {pupilProfile.name}!
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Em đã rất tự tin lắng nghe và đối thoại bằng Tiếng Anh cùng Cô Lily trong Unit {unit.unitNumber}!
          </p>

          {/* Formative 4-Dimensions Assessment Card */}
          {finalAssessment && (
            <div className="text-left bg-slate-50 border border-slate-200/90 rounded-2xl p-5 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Đánh giá năng lực giao tiếp theo 4 tiêu chí (Thang 5 mức)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Phát âm</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Mức {finalAssessment.pronunciationLevel} / 5
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{
                        width: `${(finalAssessment.pronunciationLevel / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Từ vựng</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Mức {finalAssessment.vocabularyLevel} / 5
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{
                        width: `${(finalAssessment.vocabularyLevel / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Dùng mẫu câu</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Mức {finalAssessment.languageUseLevel} / 5
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{
                        width: `${(finalAssessment.languageUseLevel / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Tương tác</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Mức {finalAssessment.communicationLevel} / 5
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{
                        width: `${(finalAssessment.communicationLevel / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Formative questions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900">
                    🌟 Em làm tốt điều gì?
                  </span>
                  <p className="text-xs text-emerald-950 mt-1 font-medium">
                    {finalAssessment.whatDidWell}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-xs font-bold text-amber-900">
                    🌱 Điểm có thể rèn thêm
                  </span>
                  <p className="text-xs text-amber-950 mt-1 font-medium">
                    {finalAssessment.whatToImprove}
                  </p>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <span className="text-xs font-bold text-sky-900">
                    🚀 Thử thách tiếp theo
                  </span>
                  <p className="text-xs text-sky-950 mt-1 font-medium">
                    {finalAssessment.whatToTryNext}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestartDialogue}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 text-sm shadow-xs transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nói chuyện lại lần nữa</span>
            </button>
            <button
              onClick={onBackToUnit}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-sm transition"
            >
              Quay lại danh sách Unit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
