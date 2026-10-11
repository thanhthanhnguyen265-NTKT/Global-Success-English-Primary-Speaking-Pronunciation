import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Search,
  AlertTriangle,
  Zap,
  GraduationCap,
  VolumeX,
} from 'lucide-react';
import { playTextToSpeech } from '../utils/speech';
import { TEACHER_KNOWLEDGE_BASE, findInstantKnowledge, KnowledgeTopic } from '../data/teacherKnowledgeBase';

export interface AssistantContext {
  grade?: number;
  unitTitle?: string;
  targetWord?: string;
  targetSentence?: string;
  topic?: string;
}

export interface TeacherAnswer {
  title: string;
  shortAnswer: string;
  explanation: string;
  keyRule: string;
  examples: Array<{ english: string; vietnamese: string; ipa?: string }>;
  whyUsed: string;
  encouragement: string;
  suggestedFollowUps: string[];
  grammarCategory?: string;
  commonMistakes?: string;
  isInstantKnowledge?: boolean;
}

interface TeacherAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: AssistantContext | null;
  initialQuestion?: string;
}

const CATEGORY_TABS = [
  { id: 'all', label: '🌟 Tất cả thắc mắc' },
  { id: 'tenses', label: '⏰ Các thì tiếng Anh' },
  { id: 'why', label: '❓ Vì sao lại dùng từ đó?' },
  { id: 'compare', label: '🔍 Phân biệt từ dễ nhầm' },
  { id: 'curriculum', label: '📚 Ngữ pháp Global Success' },
];

export const TeacherAssistantModal: React.FC<TeacherAssistantModalProps> = ({
  isOpen,
  onClose,
  context,
  initialQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [inputQuestion, setInputQuestion] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<TeacherAnswer | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: TeacherAnswer }>>([]);
  const [isPlayingTeacherVoice, setIsPlayingTeacherVoice] = useState(false);

  const recognitionRef = useRef<any>(null);
  const answerContainerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<string, TeacherAnswer>>(new Map());

  // Filter topics based on active category tab & search keyword
  const filteredTopics = useMemo(() => {
    let list = TEACHER_KNOWLEDGE_BASE;
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (searchFilter.trim()) {
      const sf = searchFilter.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(sf) ||
          t.shortAnswer.toLowerCase().includes(sf) ||
          t.keywords.some((kw) => kw.toLowerCase().includes(sf)) ||
          t.grammarCategory.toLowerCase().includes(sf)
      );
    }
    return list;
  }, [selectedCategory, searchFilter]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuestion(transcript);
        setIsListening(false);
        handleAsk(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Sync initial question on open
  useEffect(() => {
    if (initialQuestion && isOpen) {
      setInputQuestion(initialQuestion);
      handleAsk(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói tiếng Việt. Bé hãy nhập câu hỏi vào ô nhé!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Convert KnowledgeTopic to TeacherAnswer structure
  const topicToAnswer = (topic: KnowledgeTopic): TeacherAnswer => ({
    title: topic.title,
    shortAnswer: topic.shortAnswer,
    explanation: topic.explanation,
    keyRule: topic.keyRule,
    whyUsed: topic.whyUsed,
    commonMistakes: topic.commonMistakes,
    grammarCategory: topic.grammarCategory,
    examples: topic.examples,
    encouragement: topic.encouragement,
    suggestedFollowUps: topic.suggestedFollowUps,
    isInstantKnowledge: true,
  });

  // Fast direct selection of a topic
  const handleSelectTopic = (topic: KnowledgeTopic) => {
    const ans = topicToAnswer(topic);
    setCurrentAnswer(ans);
    setInputQuestion(topic.title);
    setHistory((prev) => [{ q: topic.title, a: ans }, ...prev]);
    setTimeout(() => {
      answerContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Ask question (instant search first, then fast Gemini API call)
  const handleAsk = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q) return;

    // 1. Check local query cache (<1ms)
    const cached = cacheRef.current.get(q.toLowerCase());
    if (cached) {
      setCurrentAnswer(cached);
      setTimeout(() => {
        answerContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    // 2. Check instant local knowledge base (<5ms)
    const instantHit = findInstantKnowledge(q);
    if (instantHit) {
      const instantAns = topicToAnswer(instantHit);
      cacheRef.current.set(q.toLowerCase(), instantAns);
      setCurrentAnswer(instantAns);
      setHistory((prev) => [{ q, a: instantAns }, ...prev]);
      setTimeout(() => {
        answerContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    // 3. Fallback to server endpoint with low-latency Gemini 3.8 Flash
    setLoading(true);
    try {
      const res = await fetch('/api/ask-teacher-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: context || null,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data: TeacherAnswer = await res.json();
      cacheRef.current.set(q.toLowerCase(), data);
      setCurrentAnswer(data);
      setHistory((prev) => [{ q, a: data }, ...prev]);

      setTimeout(() => {
        answerContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error asking teacher assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakExplanation = (text: string) => {
    if (isPlayingTeacherVoice) {
      window.speechSynthesis?.cancel();
      setIsPlayingTeacherVoice(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingTeacherVoice(false);
      utterance.onerror = () => setIsPlayingTeacherVoice(false);
      setIsPlayingTeacherVoice(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[94vh] flex flex-col border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-400 via-amber-300 to-yellow-400 p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-300 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-2xl flex items-center justify-center shadow-md border-2 border-amber-200">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
                  Cô Giáo Mai • Trợ Lý AI
                </h2>
                <span className="bg-white text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-2xs flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Suy nghĩ siêu tốc
                </span>
                <span className="bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-2xs">
                  ✓ Chuẩn Bộ GD&ĐT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                Tra cứu ngữ pháp, giải thích nghĩa từ, các thì & lý do dùng từ theo SGK Global Success
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition active:scale-95 shadow-xs"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Unit Learning Context Notice */}
        {context && (context.targetWord || context.targetSentence || context.unitTitle) && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                Lớp {context.grade || 'Tiểu học'}:
              </span>
              <span className="truncate">
                {context.unitTitle && `${context.unitTitle} • `}
                {context.targetWord && `Từ: "${context.targetWord}" `}
                {context.targetSentence && `Mẫu câu: "${context.targetSentence}"`}
              </span>
            </div>
            {context.targetWord && (
              <button
                onClick={() => {
                  const askStr = `Vì sao trong bài lại dùng từ "${context.targetWord}" và cách dùng trong câu thế nào?`;
                  setInputQuestion(askStr);
                  handleAsk(askStr);
                }}
                className="text-amber-800 font-extrabold hover:text-amber-950 hover:underline shrink-0 ml-2 bg-amber-200/60 px-2 py-0.5 rounded-md"
              >
                Hỏi về từ này →
              </button>
            )}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          {/* Quick Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="🔍 Tìm nhanh quy tắc ngữ pháp (VD: thì hiện tại, a an, in on at, do does, số nhiều...)"
                className="w-full bg-white border-2 border-amber-200 focus:border-amber-400 pl-10 pr-8 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 outline-hidden shadow-2xs placeholder:text-slate-400"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1 ${
                    selectedCategory === tab.id
                      ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Knowledge Topic Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Kiến thức & thắc mắc chuẩn ({filteredTopics.length} chủ đề):
              </span>
              <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Tra cứu tức thì &lt;10ms
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="text-left text-xs bg-white hover:bg-amber-50 border border-amber-200/90 hover:border-amber-400 text-slate-700 hover:text-amber-950 px-3 py-2 rounded-2xl transition flex items-center gap-2 group shadow-2xs active:scale-98"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition shrink-0" />
                  <span className="font-semibold">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ultra-Fast Loading Indicator */}
          {loading && (
            <div className="p-7 text-center bg-white rounded-3xl border-2 border-amber-300 shadow-md animate-pulse space-y-3">
              <div className="text-4xl animate-bounce">👩‍🏫</div>
              <div className="flex items-center justify-center gap-2 text-amber-900 font-extrabold text-base">
                <Zap className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Cô Mai đang đối chiếu ngữ pháp Global Success & suy nghĩ câu trả lời...</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Đang tra cứu từ điển Oxford/Cambridge, chuẩn hóa phiên âm IPA và chuẩn bị ví dụ song ngữ cho con!
              </p>
              <div className="w-48 h-1.5 bg-amber-100 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-amber-500 animate-[progress_1s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* Answer Card Display */}
          {currentAnswer && !loading && (
            <div
              ref={answerContainerRef}
              className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-300 shadow-lg space-y-5 animate-in fade-in slide-in-from-bottom-2"
            >
              {/* Answer Header & Badges */}
              <div className="border-b border-amber-100 pb-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Cô Mai giải đáp
                    </span>
                    {currentAnswer.grammarCategory && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        <GraduationCap className="w-3 h-3" />
                        {currentAnswer.grammarCategory}
                      </span>
                    )}
                    {currentAnswer.isInstantKnowledge && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ⚡ Phản hồi tức thì
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {currentAnswer.title}
                  </h3>
                </div>

                {/* Speak summary button */}
                <button
                  onClick={() => handleSpeakExplanation(`${currentAnswer.shortAnswer} ${currentAnswer.keyRule}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                    isPlayingTeacherVoice
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title="Nghe cô Mai giảng tóm tắt"
                >
                  {isPlayingTeacherVoice ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Nghe cô giảng</span>
                    </>
                  )}
                </button>
              </div>

              {/* Short Direct Summary Pill */}
              <div className="bg-linear-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3.5 rounded-r-2xl text-amber-950 text-sm sm:text-base font-bold shadow-2xs">
                💡 {currentAnswer.shortAnswer}
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Giải thích chi tiết & chuẩn xác:</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {currentAnswer.explanation}
                </div>
              </div>

              {/* Golden Memory Rule */}
              {currentAnswer.keyRule && (
                <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 p-4 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-sm sm:text-base">
                    <span>⭐</span>
                    <span>Mẹo vàng ghi nhớ của Cô Mai:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 font-extrabold leading-relaxed">
                    {currentAnswer.keyRule}
                  </p>
                </div>
              )}

              {/* Why Used Explanation (Bản chất ngữ pháp) */}
              {currentAnswer.whyUsed && (
                <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-sm">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Vì sao người bản xứ và ngữ pháp lại dùng như vậy?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {currentAnswer.whyUsed}
                  </p>
                </div>
              )}

              {/* Common Mistakes Warning Box */}
              {currentAnswer.commonMistakes && (
                <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-rose-950 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Lỗi sai học sinh hay mắc (Con cần tránh nhé!):</span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                    {currentAnswer.commonMistakes}
                  </p>
                </div>
              )}

              {/* Bilingual Examples with Audio & IPA */}
              {currentAnswer.examples && currentAnswer.examples.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ví dụ mẫu thực tế (Kèm phát âm IPA & Nút nghe):</span>
                  </h4>
                  <div className="grid gap-2">
                    {currentAnswer.examples.map((eg, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200 hover:border-amber-400 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                            "{eg.english}"
                          </div>
                          {eg.ipa && (
                            <div className="text-xs font-mono text-amber-800 font-semibold">
                              {eg.ipa}
                            </div>
                          )}
                          <div className="text-xs sm:text-sm text-slate-600 font-medium">
                            👉 {eg.vietnamese}
                          </div>
                        </div>
                        <button
                          onClick={() => playTextToSpeech(eg.english)}
                          className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 transition active:scale-95 shadow-2xs border border-amber-300"
                          title="Bấm để nghe phát âm tiếng Anh chuẩn"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Encouragement */}
              {currentAnswer.encouragement && (
                <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 p-3.5 rounded-2xl text-pink-900 text-xs sm:text-sm font-semibold">
                  <span className="text-2xl shrink-0">🌸</span>
                  <p>{currentAnswer.encouragement}</p>
                </div>
              )}

              {/* Suggested Follow-ups */}
              {currentAnswer.suggestedFollowUps && currentAnswer.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bé có thể hỏi tiếp cô câu này (Bấm vào để xem ngay):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAnswer.suggestedFollowUps.map((followUp, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => {
                          setInputQuestion(followUp);
                          handleAsk(followUp);
                        }}
                        className="text-xs bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1 border border-slate-200"
                      >
                        <span>{followUp}</span>
                        <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-amber-200 shadow-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic button for voice-to-text in Vietnamese */}
            <button
              type="button"
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-200'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
              }`}
              title={isListening ? 'Đang lắng nghe... bấm để dừng' : 'Bấm để nói câu hỏi bằng giọng nói'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Nhập câu hỏi: 'Vì sao dùng is?', 'Thì hiện tại tiếp diễn', 'Cách dùng a và an'..."
              className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-2xl px-4 py-3 text-sm sm:text-base outline-hidden transition font-medium text-slate-800 placeholder:text-slate-400"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-amber-950 flex items-center justify-center transition active:scale-95 shrink-0 font-black shadow-sm"
              title="Gửi câu hỏi cho Cô Mai"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {isListening && (
            <p className="text-center text-xs text-rose-600 font-bold mt-2 animate-bounce">
              🎙️ Cô Mai đang lắng nghe giọng nói của con... Hãy đặt câu hỏi tự nhiên nhé!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
