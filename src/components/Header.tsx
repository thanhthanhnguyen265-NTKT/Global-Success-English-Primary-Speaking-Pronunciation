import React from 'react';
import { Sparkles, Award, User, Volume2, Image as ImageIcon, Globe, ShieldCheck } from 'lucide-react';
import { PupilProfile } from '../types/curriculum';
import { InclusionSettings } from '../utils/storage';

interface HeaderProps {
  currentGrade: number;
  onSelectGrade: (grade: number) => void;
  pupilProfile: PupilProfile;
  onOpenProgress: () => void;
  onOpenTeacherMode: () => void;
  onOpenTeacherAssistant: () => void;
  inclusionSettings: InclusionSettings;
  onUpdateInclusionSettings: (newSettings: InclusionSettings) => void;
  activeView: 'grades' | 'units' | 'vocabulary' | 'sentences' | 'speaking';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  pupilProfile,
  onOpenProgress,
  onOpenTeacherMode,
  onOpenTeacherAssistant,
  inclusionSettings,
  onUpdateInclusionSettings,
  activeView,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-2xl shadow-sm border border-amber-300">
            🌟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-amber-950 tracking-tight font-serif">
                Global Success
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Lớp {currentGrade}
              </span>
            </div>
            <p className="text-xs text-amber-800/80 font-medium hidden sm:block">
              Luyện phát âm & Giao tiếp Tiếng Anh Tiểu học
            </p>
          </div>
        </div>

        {/* Center / Inclusion Accessibility Supports */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
          {/* Slow Speech Toggle (Turtle / Rabbit) */}
          <button
            onClick={() =>
              onUpdateInclusionSettings({
                ...inclusionSettings,
                slowSpeech: !inclusionSettings.slowSpeech,
              })
            }
            title={inclusionSettings.slowSpeech ? 'Tốc độ: Chậm (Dễ nghe)' : 'Tốc độ: Chuẩn tự nhiên'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              inclusionSettings.slowSpeech
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="text-sm">{inclusionSettings.slowSpeech ? '🐢' : '🐇'}</span>
            <span className="hidden md:inline">
              {inclusionSettings.slowSpeech ? 'Nói chậm (0.75x)' : 'Nói thường'}
            </span>
          </button>

          {/* Vietnamese Hints Toggle */}
          <button
            onClick={() =>
              onUpdateInclusionSettings({
                ...inclusionSettings,
                vietnameseHints: !inclusionSettings.vietnameseHints,
              })
            }
            title="Bật/Tắt nghĩa Tiếng Việt hỗ trợ"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              inclusionSettings.vietnameseHints
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Nghĩa tiếng Việt</span>
          </button>

          {/* Picture Support Toggle */}
          <button
            onClick={() =>
              onUpdateInclusionSettings({
                ...inclusionSettings,
                pictureSupport: !inclusionSettings.pictureSupport,
              })
            }
            title="Bật/Tắt hình ảnh minh họa"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition-all ${
              inclusionSettings.pictureSupport
                ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-700" />
            <span className="hidden md:inline">Tranh gợi ý</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Ask AI Teacher Button */}
          <button
            onClick={onOpenTeacherAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-amber-950 font-black rounded-xl shadow-xs transition text-xs sm:text-sm border border-amber-300"
            title="Mở cô giáo trợ lý AI giải đáp thắc mắc ngữ pháp, nghĩa từ, các thì"
          >
            <span className="text-base">👩‍🏫</span>
            <span className="hidden sm:inline">Hỏi Cô Giáo AI</span>
          </button>

          {/* Pupil Progress Button */}
          <button
            onClick={onOpenProgress}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition text-amber-900 font-semibold text-xs sm:text-sm"
          >
            <span className="text-base">{pupilProfile.avatar}</span>
            <span className="hidden sm:inline font-bold">{pupilProfile.name}</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-bold bg-white px-1.5 py-0.5 rounded-lg border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>{pupilProfile.starsEarned}</span>
            </div>
          </button>

          {/* Teacher Mode Button */}
          <button
            onClick={onOpenTeacherMode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-xs transition font-medium text-xs sm:text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Giáo viên</span>
          </button>
        </div>
      </div>
    </header>
  );
};
