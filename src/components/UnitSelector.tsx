import React, { useState } from 'react';
import { Unit, GradeLevel } from '../types/curriculum';
import { ArrowLeft, BookOpen, MessageSquare, Mic, Sparkles, Plus, Edit3, Search } from 'lucide-react';

interface UnitSelectorProps {
  grade: GradeLevel;
  units: Unit[];
  onSelectUnitActivity: (
    unit: Unit,
    activity: 'vocabulary' | 'sentences' | 'speaking'
  ) => void;
  onBackToGrades: () => void;
  onOpenTeacherMode: () => void;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  grade,
  units,
  onSelectUnitActivity,
  onBackToGrades,
  onOpenTeacherMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<'all' | 'sem1' | 'sem2'>('all');

  const gradeUnits = units.filter((u) => u.grade === grade);

  const filteredUnits = gradeUnits.filter((unit) => {
    const matchesSearch =
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.topic.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (unitFilter === 'sem1') {
      return unit.unitNumber <= (grade <= 2 ? 8 : 10);
    } else if (unitFilter === 'sem2') {
      return unit.unitNumber > (grade <= 2 ? 8 : 10);
    }
    return true;
  });

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-amber-200/60">
        <button
          onClick={onBackToGrades}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Chọn khối lớp khác</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-2xl">🎒</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Chương trình Global Success Lớp {grade}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Đầy đủ {gradeUnits.length} Units theo sách giáo khoa chuẩn
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTeacherMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Chế độ Giáo viên</span>
        </button>
      </div>

      {/* Search & Semester Tabs Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm Unit theo tên hoặc chủ đề (VD: zoo, food, time...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setUnitFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              unitFilter === 'all'
                ? 'bg-amber-400 text-amber-950 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({gradeUnits.length})
          </button>
          <button
            onClick={() => setUnitFilter('sem1')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              unitFilter === 'sem1'
                ? 'bg-amber-400 text-amber-950 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Học kỳ 1 (Unit 1 - {grade <= 2 ? 8 : 10})
          </button>
          <button
            onClick={() => setUnitFilter('sem2')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              unitFilter === 'sem2'
                ? 'bg-amber-400 text-amber-950 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Học kỳ 2 (Unit {grade <= 2 ? 9 : 11} - {gradeUnits.length})
          </button>
        </div>
      </div>

      {gradeUnits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <p className="text-4xl mb-3">📚</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Chưa có bài học cho Lớp {grade}
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Thầy cô có thể thêm nội dung SGK Global Success hoặc nhập file JSON bài học ngay trong Chế độ Giáo viên.
          </p>
          <button
            onClick={onOpenTeacherMode}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài học mới</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUnits.map((unit) => {
            // Aggregate counts across lessons in this unit
            const totalVocab = unit.lessons.reduce(
              (acc, l) => acc + l.vocabulary.length,
              0
            );
            const totalSentences = unit.lessons.reduce(
              (acc, l) => acc + l.sentencePatterns.length,
              0
            );
            const totalSpeaking = unit.lessons.reduce(
              (acc, l) => acc + l.speakingActivities.length,
              0
            );

            return (
              <div
                key={unit.id}
                className="bg-white rounded-3xl border border-amber-200/70 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Header of Card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center text-2xl border border-amber-200">
                        {unit.icon || '📖'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                          Unit {unit.unitNumber}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                          {unit.title.replace(/^Unit \d+:\s*/, '')}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="font-semibold text-slate-700">Chủ đề: </span>
                    {unit.topic}
                  </p>

                  {/* Summary of content */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-5">
                    <span>{totalVocab} Từ vựng</span>
                    <span>•</span>
                    <span>{totalSentences} Mẫu câu</span>
                    <span>•</span>
                    <span>{totalSpeaking} Hội thoại</span>
                  </div>
                </div>

                {/* 3 Core Practice Activities */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Activity 1: Vocabulary */}
                    <button
                      onClick={() => onSelectUnitActivity(unit, 'vocabulary')}
                      className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 transition active:scale-95 group"
                    >
                      <BookOpen className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Từ Vựng</span>
                      <span className="text-[10px] text-amber-800/80">
                        {totalVocab} từ
                      </span>
                    </button>

                    {/* Activity 2: Sentence Patterns */}
                    <button
                      onClick={() => onSelectUnitActivity(unit, 'sentences')}
                      className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 transition active:scale-95 group"
                    >
                      <MessageSquare className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Mẫu Câu</span>
                      <span className="text-[10px] text-emerald-800/80">
                        {totalSentences} mẫu
                      </span>
                    </button>

                    {/* Activity 3: Speaking Practice */}
                    <button
                      onClick={() => onSelectUnitActivity(unit, 'speaking')}
                      className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 transition active:scale-95 group"
                    >
                      <Mic className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Giao Tiếp AI</span>
                      <span className="text-[10px] text-sky-800/80">
                        Cô Lily
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
