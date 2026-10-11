import React from 'react';
import { GradeLevel } from '../types/curriculum';
import { BookOpen, Sparkles, Star, ArrowRight } from 'lucide-react';

interface GradeSelectorProps {
  onSelectGrade: (grade: GradeLevel) => void;
  selectedGrade: GradeLevel;
}

interface GradeInfo {
  grade: GradeLevel;
  title: string;
  vietnameseTitle: string;
  ageDesc: string;
  themeColor: string;
  borderHover: string;
  badgeBg: string;
  badgeText: string;
  mascotEmoji: string;
  description: string;
  unitCount: number;
}

const GRADES_DATA: GradeInfo[] = [
  {
    grade: 1,
    title: 'Grade 1',
    vietnameseTitle: 'Tiếng Anh Lớp 1',
    ageDesc: 'Dành cho bé 6 tuổi',
    themeColor: 'from-amber-400 to-orange-400',
    borderHover: 'hover:border-amber-400',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    mascotEmoji: '🐱',
    description: 'Làm quen âm chữ cái (Letters B, C, A...), từ vựng đồ vật xung quanh & câu chào hỏi đơn giản.',
    unitCount: 16,
  },
  {
    grade: 2,
    title: 'Grade 2',
    vietnameseTitle: 'Tiếng Anh Lớp 2',
    ageDesc: 'Dành cho bé 7 tuổi',
    themeColor: 'from-emerald-400 to-teal-500',
    borderHover: 'hover:border-emerald-400',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    mascotEmoji: '🐶',
    description: 'Phát âm vui nhộn các phụ âm P, K, S, H... tiệc sinh nhật, hoạt động vui chơi sân vườn.',
    unitCount: 16,
  },
  {
    grade: 3,
    title: 'Grade 3',
    vietnameseTitle: 'Tiếng Anh Lớp 3',
    ageDesc: 'Dành cho học sinh 8 tuổi',
    themeColor: 'from-sky-400 to-blue-500',
    borderHover: 'hover:border-sky-400',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    mascotEmoji: '🐼',
    description: 'Giao tiếp hỏi tên, đánh vần, hỏi thăm sức khỏe, các bộ phận cơ thể & trường lớp.',
    unitCount: 20,
  },
  {
    grade: 4,
    title: 'Grade 4',
    vietnameseTitle: 'Tiếng Anh Lớp 4',
    ageDesc: 'Dành cho học sinh 9 tuổi',
    themeColor: 'from-purple-400 to-indigo-500',
    borderHover: 'hover:border-purple-400',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    mascotEmoji: '🦁',
    description: 'Nói về quốc tịch, bạn bè bốn phương, giờ giấc sinh hoạt trong ngày & các thứ trong tuần.',
    unitCount: 20,
  },
  {
    grade: 5,
    title: 'Grade 5',
    vietnameseTitle: 'Tiếng Anh Lớp 5',
    ageDesc: 'Dành cho học sinh 10 tuổi',
    themeColor: 'from-rose-400 to-pink-500',
    borderHover: 'hover:border-rose-400',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    mascotEmoji: '🦄',
    description: 'Miêu tả ngoại hình, tính cách, địa chỉ nhà, sở thích thời gian rảnh rỗi & nghề nghiệp tương lai.',
    unitCount: 20,
  },
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  onSelectGrade,
  selectedGrade,
}) => {
  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4">
      {/* Friendly Banner */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs sm:text-sm mb-3 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Bộ sách giáo khoa Global Success - NXB Giáo dục Việt Nam</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Chọn Khối Lớp Của Em
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          Cùng luyện nghe chuẩn, ghi âm giọng nói và nhận đánh giá phát âm thông minh từ Cô giáo AI Teacher Lily!
        </p>
      </div>

      {/* 5 Big Friendly Grade Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {GRADES_DATA.map((item) => {
          const isSelected = selectedGrade === item.grade;
          return (
            <button
              key={item.grade}
              onClick={() => onSelectGrade(item.grade)}
              className={`group text-left p-6 rounded-3xl bg-white border-2 transition-all duration-200 transform hover:-translate-y-1.5 hover:shadow-xl active:translate-y-0 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 shadow-md ring-4 ring-amber-100'
                  : 'border-slate-200/80 shadow-xs ' + item.borderHover
              }`}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${item.themeColor}`}
              />

              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    {item.mascotEmoji}
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeText}`}
                  >
                    {item.ageDesc}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-sm font-semibold text-slate-500">
                      ({item.vietnameseTitle})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {item.unitCount} Chủ đề bài học chuẩn Global Success
                  </p>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-amber-700 group-hover:text-amber-600">
                  <BookOpen className="w-4 h-4" />
                  <span>Vào học ngay</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-400 group-hover:text-amber-950 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
