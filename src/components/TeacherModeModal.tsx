import React, { useState } from 'react';
import {
  Unit,
  Lesson,
  VocabularyItem,
  SentencePatternItem,
  SpeakingPromptItem,
  PupilPracticeRecord,
  GradeLevel,
} from '../types/curriculum';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  Check,
  BookOpen,
  Users,
  Database,
  Search,
} from 'lucide-react';
import {
  saveCurriculum,
  exportCurriculumAsJson,
  resetCurriculumToDefault,
} from '../utils/storage';

interface TeacherModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: Unit[];
  onUpdateCurriculum: (newCurriculum: Unit[]) => void;
  practiceRecords: PupilPracticeRecord[];
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  isOpen,
  onClose,
  curriculum,
  onUpdateCurriculum,
  practiceRecords,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'records' | 'backup'>('content');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    curriculum.find((u) => u.grade === 1)?.id || curriculum[0]?.id || ''
  );

  // Search filter for pupil records
  const [recordsFilter, setRecordsFilter] = useState('');

  // New item modal states
  const [isAddingVocab, setIsAddingVocab] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newEmoji, setNewEmoji] = useState('📘');
  const [newPhonics, setNewPhonics] = useState('');

  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const [newEnglishPattern, setNewEnglishPattern] = useState('');
  const [newPatternMeaning, setNewPatternMeaning] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitTopic, setNewUnitTopic] = useState('');
  const [newUnitIcon, setNewUnitIcon] = useState('📘');

  if (!isOpen) return null;

  const currentUnit = curriculum.find((u) => u.id === selectedUnitId);

  // Add new Unit
  const handleCreateUnit = () => {
    if (!newUnitTitle.trim()) return;
    const gradeUnits = curriculum.filter((u) => u.grade === selectedGrade);
    const newUnitNumber = gradeUnits.length + 1;

    const newUnit: Unit = {
      id: `g${selectedGrade}-u${Date.now()}`,
      grade: selectedGrade,
      unitNumber: newUnitNumber,
      title: `Unit ${newUnitNumber}: ${newUnitTitle.trim()}`,
      topic: newUnitTopic.trim() || 'General Vocabulary',
      icon: newUnitIcon.trim() || '📘',
      lessons: [
        {
          id: `g${selectedGrade}-u${Date.now()}-l1`,
          lessonNumber: 1,
          title: 'Lesson 1',
          vocabulary: [],
          sentencePatterns: [],
          speakingActivities: [
            {
              id: `spk-${Date.now()}`,
              title: 'Speaking practice',
              question: `Hello! Welcome to ${newUnitTitle.trim()}! How are you?`,
              expectedAnswer: "I'm fine, thank you.",
              scaffoldHints: ["I'm fine, thank you.", 'Hello teacher!'],
            },
          ],
        },
      ],
    };

    const updated = [...curriculum, newUnit];
    onUpdateCurriculum(updated);
    saveCurriculum(updated);
    setSelectedUnitId(newUnit.id);
    setIsAddingUnit(false);
    setNewUnitTitle('');
    setNewUnitTopic('');
  };

  // Delete Unit
  const handleDeleteUnit = (unitId: string) => {
    if (confirm('Thầy/Cô có chắc chắn muốn xóa bài học này không?')) {
      const updated = curriculum.filter((u) => u.id !== unitId);
      onUpdateCurriculum(updated);
      saveCurriculum(updated);
      const remaining = updated.find((u) => u.grade === selectedGrade);
      setSelectedUnitId(remaining?.id || '');
    }
  };

  // Add Vocabulary to current Unit
  const handleAddVocabulary = () => {
    if (!newWord.trim() || !currentUnit) return;
    const newVocabItem: VocabularyItem = {
      id: `voc-${Date.now()}`,
      word: newWord.trim(),
      ipa: newIpa.trim() || `/${newWord.toLowerCase()}/`,
      vietnamese: newMeaning.trim() || newWord.trim(),
      imageEmojiOrUrl: newEmoji.trim() || '🌟',
      soundPhonics: newPhonics.trim() || undefined,
    };

    const updated = curriculum.map((u) => {
      if (u.id === currentUnit.id) {
        const firstLesson = u.lessons[0] || {
          id: `l-${Date.now()}`,
          lessonNumber: 1,
          title: 'Lesson 1',
          vocabulary: [],
          sentencePatterns: [],
          speakingActivities: [],
        };
        const updatedLesson: Lesson = {
          ...firstLesson,
          vocabulary: [...firstLesson.vocabulary, newVocabItem],
        };
        return {
          ...u,
          lessons: [updatedLesson, ...u.lessons.slice(1)],
        };
      }
      return u;
    });

    onUpdateCurriculum(updated);
    saveCurriculum(updated);
    setNewWord('');
    setNewIpa('');
    setNewMeaning('');
    setIsAddingVocab(false);
  };

  // Delete Vocabulary
  const handleDeleteVocab = (vocabId: string) => {
    if (!currentUnit) return;
    const updated = curriculum.map((u) => {
      if (u.id === currentUnit.id) {
        return {
          ...u,
          lessons: u.lessons.map((l) => ({
            ...l,
            vocabulary: l.vocabulary.filter((v) => v.id !== vocabId),
          })),
        };
      }
      return u;
    });
    onUpdateCurriculum(updated);
    saveCurriculum(updated);
  };

  // Add Sentence Pattern
  const handleAddPattern = () => {
    if (!newEnglishPattern.trim() || !currentUnit) return;
    const newPatternItem: SentencePatternItem = {
      id: `pat-${Date.now()}`,
      english: newEnglishPattern.trim(),
      vietnamese: newPatternMeaning.trim() || newEnglishPattern.trim(),
      focusStructure: newEnglishPattern.trim(),
      dialogueExchange: newPrompt.trim()
        ? {
            prompt: newPrompt.trim(),
            response: newResponse.trim() || newEnglishPattern.trim(),
          }
        : undefined,
    };

    const updated = curriculum.map((u) => {
      if (u.id === currentUnit.id) {
        const firstLesson = u.lessons[0];
        if (!firstLesson) return u;
        return {
          ...u,
          lessons: [
            {
              ...firstLesson,
              sentencePatterns: [...firstLesson.sentencePatterns, newPatternItem],
            },
            ...u.lessons.slice(1),
          ],
        };
      }
      return u;
    });

    onUpdateCurriculum(updated);
    saveCurriculum(updated);
    setNewEnglishPattern('');
    setNewPatternMeaning('');
    setNewPrompt('');
    setNewResponse('');
    setIsAddingPattern(false);
  };

  // Delete Sentence Pattern
  const handleDeletePattern = (patternId: string) => {
    if (!currentUnit) return;
    const updated = curriculum.map((u) => {
      if (u.id === currentUnit.id) {
        return {
          ...u,
          lessons: u.lessons.map((l) => ({
            ...l,
            sentencePatterns: l.sentencePatterns.filter((p) => p.id !== patternId),
          })),
        };
      }
      return u;
    });
    onUpdateCurriculum(updated);
    saveCurriculum(updated);
  };

  // Import JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onUpdateCurriculum(parsed);
          saveCurriculum(parsed);
          alert('Nhập dữ liệu thành công!');
        } else {
          alert('File JSON không đúng định dạng chương trình Global Success.');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Khôi phục toàn bộ bài học mặc định của Global Success? Các chỉnh sửa thủ công sẽ được đặt lại.')) {
      const def = resetCurriculumToDefault();
      onUpdateCurriculum(def);
      alert('Đã khôi phục dữ liệu SGK Global Success gốc.');
    }
  };

  const filteredRecords = practiceRecords.filter(
    (r) =>
      r.pupilName.toLowerCase().includes(recordsFilter.toLowerCase()) ||
      r.unitTitle.toLowerCase().includes(recordsFilter.toLowerCase()) ||
      r.targetText.toLowerCase().includes(recordsFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-xl shadow-xs">
              👩‍🏫
            </div>
            <div>
              <h3 className="text-lg font-bold">Chế độ Quản lý Dành cho Giáo viên</h3>
              <p className="text-xs text-slate-300">
                Thêm, sửa nội dung Global Success & Theo dõi sự tiến bộ của học sinh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Soạn giáo trình SGK</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'records'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kết quả học sinh ({practiceRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Sao lưu & Nhập JSON</span>
          </button>
        </div>

        {/* Tab 1: Curriculum Content Manager */}
        {activeTab === 'content' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Grade Selector Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Khối Lớp:</span>
                {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGrade(g);
                      const firstOfGrade = curriculum.find((u) => u.grade === g);
                      setSelectedUnitId(firstOfGrade?.id || '');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedGrade === g
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddingUnit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Unit mới</span>
              </button>
            </div>

            {/* Modal to add unit */}
            {isAddingUnit && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-emerald-950">
                  Thêm Unit mới vào Lớp {selectedGrade}:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Tên bài học (VD: At the zoo)"
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    className="px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Chủ đề (VD: Animals & Letter Z)"
                    value={newUnitTopic}
                    onChange={(e) => setNewUnitTopic(e.target.value)}
                    className="px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Biểu tượng Emoji (VD: 🦁)"
                    value={newUnitIcon}
                    onChange={(e) => setNewUnitIcon(e.target.value)}
                    className="px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingUnit(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateUnit}
                    className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Lưu Unit
                  </button>
                </div>
              </div>
            )}

            {/* Units in this Grade list */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Danh sách các Unit của Lớp {selectedGrade}:
              </span>
              <div className="flex flex-wrap gap-2">
                {curriculum
                  .filter((u) => u.grade === selectedGrade)
                  .map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedUnitId === unit.id
                          ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{unit.icon}</span>
                      <span>Unit {unit.unitNumber}: {unit.title.replace(/^Unit \d+:\s*/, '')}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Selected Unit Content Editor */}
            {currentUnit ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {currentUnit.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Chủ đề: {currentUnit.topic}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUnit(currentUnit.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Unit này</span>
                  </button>
                </div>

                {/* Section A: Vocabulary in this Unit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Từ vựng ({currentUnit.lessons[0]?.vocabulary.length || 0} từ)
                    </span>
                    <button
                      onClick={() => setIsAddingVocab(!isAddingVocab)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm từ vựng</span>
                    </button>
                  </div>

                  {isAddingVocab && (
                    <div className="p-4 bg-white border border-indigo-200 rounded-xl mb-4 space-y-3 shadow-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Từ tiếng Anh (VD: cat)"
                          value={newWord}
                          onChange={(e) => setNewWord(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Phiên âm IPA (VD: /kæt/)"
                          value={newIpa}
                          onChange={(e) => setNewIpa(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Nghĩa tiếng Việt (VD: con mèo)"
                          value={newMeaning}
                          onChange={(e) => setNewMeaning(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Emoji / URL ảnh (VD: 🐱)"
                          value={newEmoji}
                          onChange={(e) => setNewEmoji(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsAddingVocab(false)}
                          className="px-3 py-1 text-xs text-slate-500 font-bold"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleAddVocabulary}
                          className="px-4 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                        >
                          Lưu từ vựng
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentUnit.lessons[0]?.vocabulary.map((vocab) => (
                      <div
                        key={vocab.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{vocab.imageEmojiOrUrl}</span>
                          <div>
                            <span className="font-bold text-slate-900">{vocab.word}</span>
                            <span className="font-mono text-slate-500 ml-1.5">{vocab.ipa}</span>
                            <p className="text-slate-600 text-[11px]">{vocab.vietnamese}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteVocab(vocab.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Sentence Patterns in this Unit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Mẫu câu ({currentUnit.lessons[0]?.sentencePatterns.length || 0} mẫu)
                    </span>
                    <button
                      onClick={() => setIsAddingPattern(!isAddingPattern)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm mẫu câu</span>
                    </button>
                  </div>

                  {isAddingPattern && (
                    <div className="p-4 bg-white border border-indigo-200 rounded-xl mb-4 space-y-3 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Câu tiếng Anh (VD: What colour is it?)"
                          value={newEnglishPattern}
                          onChange={(e) => setNewEnglishPattern(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Nghĩa tiếng Việt (VD: Nó màu gì?)"
                          value={newPatternMeaning}
                          onChange={(e) => setNewPatternMeaning(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Hỏi (tùy chọn) (VD: What colour is it?)"
                          value={newPrompt}
                          onChange={(e) => setNewPrompt(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Đáp (tùy chọn) (VD: It's red.)"
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsAddingPattern(false)}
                          className="px-3 py-1 text-xs text-slate-500 font-bold"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleAddPattern}
                          className="px-4 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                        >
                          Lưu mẫu câu
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {currentUnit.lessons[0]?.sentencePatterns.map((pat) => (
                      <div
                        key={pat.id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{pat.english}</p>
                          <p className="text-slate-500">{pat.vietnamese}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePattern(pat.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Chưa chọn Unit.</p>
            )}
          </div>
        )}

        {/* Tab 2: Pupil Practice Records Table */}
        {activeTab === 'records' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm theo tên học sinh, bài học, từ..."
                  value={recordsFilter}
                  onChange={(e) => setRecordsFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <span className="text-xs font-bold text-slate-500">
                Tổng số lượt luyện: {filteredRecords.length}
              </span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-sm font-bold text-slate-700">
                  Chưa có dữ liệu bài làm của học sinh
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Khi học sinh luyện tập ghi âm và đối thoại, kết quả sẽ tự động lưu về đây.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Học sinh</th>
                      <th className="px-4 py-3">Lớp / Unit</th>
                      <th className="px-4 py-3">Hoạt động</th>
                      <th className="px-4 py-3">Nội dung</th>
                      <th className="px-4 py-3">Mức năng lực</th>
                      <th className="px-4 py-3">Số lần thử</th>
                      <th className="px-4 py-3">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {r.pupilName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          Lớp {r.grade} • Unit {r.unitNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              r.activityType === 'vocabulary'
                                ? 'bg-amber-100 text-amber-900'
                                : r.activityType === 'sentence'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-sky-100 text-sky-900'
                            }`}
                          >
                            {r.activityType === 'vocabulary'
                              ? 'Từ vựng'
                              : r.activityType === 'sentence'
                              ? 'Mẫu câu'
                              : 'Giao tiếp'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          "{r.targetText}"
                        </td>
                        <td className="px-4 py-3 font-bold text-indigo-700">
                          {r.overallLevel} ({r.pronunciationScore}/5)
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {r.attempts} lần
                        </td>
                        <td className="px-4 py-3 text-slate-500">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Backup & Import JSON */}
        {activeTab === 'backup' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Xuất file sao lưu toàn bộ giáo trình (Export JSON)
              </h4>
              <p className="text-xs text-slate-600">
                Tải xuống file JSON chứa toàn bộ bài học, từ vựng, phiên âm IPA, mẫu câu và câu hỏi giao tiếp hiện có để lưu trữ hoặc chuyển sang máy tính khác.
              </p>
              <button
                onClick={() => exportCurriculumAsJson(curriculum)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống file JSON</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Nhập giáo trình từ file JSON (Import JSON)
              </h4>
              <p className="text-xs text-slate-600">
                Tải lên file JSON chứa các bài học Global Success của trường để cập nhật vào ứng dụng.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs">
                <Upload className="w-4 h-4" />
                <span>Chọn file JSON để tải lên</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 space-y-3">
              <h4 className="font-extrabold text-rose-950 text-sm">
                Khôi phục bài học mặc định Global Success
              </h4>
              <p className="text-xs text-rose-900">
                Đặt lại toàn bộ giáo trình Lớp 1 - 5 về bản gốc của NXB Giáo dục Việt Nam.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khôi phục bản gốc</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
