import React, { useState } from 'react';
import { PupilProfile, PupilPracticeRecord } from '../types/curriculum';
import { X, Sparkles, Award, Star, BookOpen, MessageSquare, Mic, Edit2, Check } from 'lucide-react';
import { savePupilProfile } from '../utils/storage';

interface PupilProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  pupilProfile: PupilProfile;
  onUpdatePupilProfile: (profile: PupilProfile) => void;
  practiceRecords: PupilPracticeRecord[];
}

const AVATARS = ['🐰', '🐱', '🐶', '🐼', '🦁', '🦄', '🐨', '🐯'];

export const PupilProgressModal: React.FC<PupilProgressModalProps> = ({
  isOpen,
  onClose,
  pupilProfile,
  onUpdatePupilProfile,
  practiceRecords,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(pupilProfile.name);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (newName.trim()) {
      const updated = { ...pupilProfile, name: newName.trim() };
      onUpdatePupilProfile(updated);
      savePupilProfile(updated);
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatar: string) => {
    const updated = { ...pupilProfile, avatar };
    onUpdatePupilProfile(updated);
    savePupilProfile(updated);
  };

  // Compute average score from recent records
  const avgScore =
    practiceRecords.length > 0
      ? (
          practiceRecords.reduce((acc, r) => acc + r.pronunciationScore, 0) /
          practiceRecords.length
        ).toFixed(1)
      : '4.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-black tracking-tight">
              Góc Học Tập Của Em (Hồ Sơ Năng Lực)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/40 text-amber-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Pupil Avatar & Name Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50 p-4 rounded-3xl border border-amber-200">
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl bg-white border-2 border-amber-300 flex items-center justify-center text-4xl shadow-sm">
                {pupilProfile.avatar}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {!isEditingName ? (
                  <>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {pupilProfile.name}
                    </h4>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Đổi tên"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-2.5 py-1 text-sm font-bold bg-white border border-amber-300 rounded-lg"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-amber-500 text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-amber-900 font-semibold">
                Học sinh Tiếng Anh Global Success Lớp {pupilProfile.grade}
              </p>

              {/* Avatar Picker buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-1 pt-1">
                <span className="text-[10px] text-slate-500 font-bold mr-1">
                  Đổi ảnh:
                </span>
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => handleSelectAvatar(av)}
                    className={`w-7 h-7 rounded-lg text-base flex items-center justify-center transition ${
                      pupilProfile.avatar === av
                        ? 'bg-amber-300 border border-amber-400 scale-110 shadow-2xs'
                        : 'bg-white hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Stars count */}
            <div className="flex sm:flex-col items-center justify-center bg-white px-4 py-3 rounded-2xl border border-amber-200 shadow-2xs">
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
              <div className="text-xl font-black text-amber-900 ml-2 sm:ml-0">
                {pupilProfile.starsEarned}
              </div>
              <span className="text-[10px] text-slate-500 font-bold">
                Ngôi sao đạt được
              </span>
            </div>
          </div>

          {/* Child-friendly 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-center">
              <BookOpen className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-slate-900">
                {pupilProfile.wordsPracticedCount}
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                Từ vựng đã luyện
              </span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 text-center">
              <MessageSquare className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-slate-900">
                {pupilProfile.sentencesPracticedCount}
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                Mẫu câu hoàn thành
              </span>
            </div>

            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 text-center">
              <Mic className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-slate-900">
                {pupilProfile.speakingSessionsCount}
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                Buổi trò chuyện AI
              </span>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 text-center">
              <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-purple-900">
                {avgScore} / 5
              </div>
              <span className="text-[11px] font-bold text-purple-700">
                Điểm phát âm TB
              </span>
            </div>
          </div>

          {/* Encouraging Competency Badges */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Huy hiệu khích lệ năng lực
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-2xl">🌟</span>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Phát âm To & Rõ ràng
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Luôn nỗ lực phát âm trọn vẹn âm cuối
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-2xl">🗣️</span>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Tự tin Giao tiếp
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Tích cực đối thoại cùng Cô Lily
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-2xl">🚀</span>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Chăm chỉ Rèn luyện
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Sẵn sàng thử lại để ngày một tiến bộ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Practice History */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nhật ký luyện tập gần đây
            </h4>
            {practiceRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Chưa có buổi luyện tập nào. Em hãy vào các Unit để bắt đầu nhé!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {practiceRecords.slice(0, 5).map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">
                        {rec.targetText}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {rec.unitTitle} • {rec.date}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      {rec.overallLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
