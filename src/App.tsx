import React, { useState, useEffect } from 'react';
import { Unit, GradeLevel, PupilProfile, PupilPracticeRecord } from './types/curriculum';
import {
  loadCurriculum,
  loadPupilProfile,
  savePupilProfile,
  loadPracticeRecords,
  loadInclusionSettings,
  saveInclusionSettings,
  InclusionSettings,
} from './utils/storage';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { UnitSelector } from './components/UnitSelector';
import { VocabularyPractice } from './components/VocabularyPractice';
import { SentencePractice } from './components/SentencePractice';
import { SpeakingPractice } from './components/SpeakingPractice';
import { TeacherModeModal } from './components/TeacherModeModal';
import { PupilProgressModal } from './components/PupilProgressModal';
import { TeacherAssistantModal, AssistantContext } from './components/TeacherAssistantModal';
import { Sparkles, MessageCircle } from 'lucide-react';

export default function App() {
  const [curriculum, setCurriculum] = useState<Unit[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeView, setActiveView] = useState<
    'grades' | 'units' | 'vocabulary' | 'sentences' | 'speaking'
  >('grades');

  const [pupilProfile, setPupilProfile] = useState<PupilProfile>(loadPupilProfile());
  const [practiceRecords, setPracticeRecords] = useState<PupilPracticeRecord[]>([]);
  const [inclusionSettings, setInclusionSettings] = useState<InclusionSettings>(loadInclusionSettings());

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<AssistantContext | null>(null);
  const [assistantInitialQuestion, setAssistantInitialQuestion] = useState('');

  // Open Teacher Assistant with optional context
  const handleOpenAssistant = (contextData?: AssistantContext, initialQ?: string) => {
    setAssistantContext(
      contextData || {
        grade: selectedGrade,
        unitTitle: selectedUnit?.title,
        topic: selectedUnit?.topic,
      }
    );
    setAssistantInitialQuestion(initialQ || '');
    setIsAssistantModalOpen(true);
  };

  // Initialize data on mount
  useEffect(() => {
    const loadedCurriculum = loadCurriculum();
    setCurriculum(loadedCurriculum);
    setPracticeRecords(loadPracticeRecords());
  }, []);

  const handleUpdateInclusionSettings = (newSettings: InclusionSettings) => {
    setInclusionSettings(newSettings);
    saveInclusionSettings(newSettings);
  };

  const handleUpdatePupilProfile = (newProfile: PupilProfile) => {
    setPupilProfile(newProfile);
    savePupilProfile(newProfile);
  };

  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setActiveView('units');
  };

  const handleSelectUnitActivity = (
    unit: Unit,
    activity: 'vocabulary' | 'sentences' | 'speaking'
  ) => {
    setSelectedUnit(unit);
    setActiveView(activity);
  };

  const handleBackToGrades = () => {
    setActiveView('grades');
  };

  const handleBackToUnit = () => {
    setActiveView('units');
  };

  const handleNavigateHome = () => {
    setActiveView('grades');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800 font-sans selection:bg-amber-200">
      {/* App Header */}
      <Header
        currentGrade={selectedGrade}
        onSelectGrade={(g) => {
          setSelectedGrade(g as GradeLevel);
          setActiveView('units');
        }}
        pupilProfile={pupilProfile}
        onOpenProgress={() => setIsProgressModalOpen(true)}
        onOpenTeacherMode={() => setIsTeacherModalOpen(true)}
        onOpenTeacherAssistant={() => handleOpenAssistant()}
        inclusionSettings={inclusionSettings}
        onUpdateInclusionSettings={handleUpdateInclusionSettings}
        activeView={activeView}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Learning Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {activeView === 'grades' && (
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelectGrade={handleSelectGrade}
          />
        )}

        {activeView === 'units' && (
          <UnitSelector
            grade={selectedGrade}
            units={curriculum}
            onSelectUnitActivity={handleSelectUnitActivity}
            onBackToGrades={handleBackToGrades}
            onOpenTeacherMode={() => setIsTeacherModalOpen(true)}
          />
        )}

        {activeView === 'vocabulary' && selectedUnit && (
          <VocabularyPractice
            unit={selectedUnit}
            grade={selectedGrade}
            onBackToUnit={handleBackToUnit}
            inclusionSettings={inclusionSettings}
            pupilProfile={pupilProfile}
            onUpdatePupilProfile={handleUpdatePupilProfile}
            onAskAssistant={(word, question) =>
              handleOpenAssistant(
                {
                  grade: selectedGrade,
                  unitTitle: selectedUnit.title,
                  targetWord: word,
                  topic: selectedUnit.topic,
                },
                question
              )
            }
          />
        )}

        {activeView === 'sentences' && selectedUnit && (
          <SentencePractice
            unit={selectedUnit}
            grade={selectedGrade}
            onBackToUnit={handleBackToUnit}
            inclusionSettings={inclusionSettings}
            pupilProfile={pupilProfile}
            onUpdatePupilProfile={handleUpdatePupilProfile}
            onAskAssistant={(sentence, question) =>
              handleOpenAssistant(
                {
                  grade: selectedGrade,
                  unitTitle: selectedUnit.title,
                  targetSentence: sentence,
                  topic: selectedUnit.topic,
                },
                question
              )
            }
          />
        )}

        {activeView === 'speaking' && selectedUnit && (
          <SpeakingPractice
            unit={selectedUnit}
            grade={selectedGrade}
            onBackToUnit={handleBackToUnit}
            inclusionSettings={inclusionSettings}
            pupilProfile={pupilProfile}
            onUpdatePupilProfile={handleUpdatePupilProfile}
          />
        )}
      </main>

      {/* Floating Action Button: Quick Ask AI Teacher */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => handleOpenAssistant()}
          className="group flex items-center gap-2.5 px-4 py-3 bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-white ring-4 ring-amber-300/40"
          title="Bấm để hỏi Cô giáo trợ lý AI bất kỳ thắc mắc nào"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">👩‍🏫</span>
          <div className="text-left hidden sm:block">
            <div className="text-xs uppercase font-extrabold text-amber-900 leading-tight">
              Trợ lý học tập
            </div>
            <div className="text-sm font-black tracking-tight leading-none">
              Hỏi Cô Giáo AI
            </div>
          </div>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Child-Friendly Footer */}
      <footer className="mt-auto py-6 border-t border-amber-200/50 bg-white/70 text-center text-xs text-slate-500 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span className="font-semibold text-slate-700">
              Tiếng Anh Tiểu học Global Success (Lớp 1 – Lớp 5)
            </span>
          </div>
          <p className="text-slate-500">
            Học tập định hướng phát triển năng lực giao tiếp • Đánh giá quá trình mang tính khích lệ
          </p>
          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-800 font-bold transition"
          >
            Dành cho Thầy Cô giáo ↗
          </button>
        </div>
      </footer>

      {/* Teacher Mode Modal */}
      <TeacherModeModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          // Refresh records and curriculum
          setCurriculum(loadCurriculum());
          setPracticeRecords(loadPracticeRecords());
        }}
        curriculum={curriculum}
        onUpdateCurriculum={(newCurriculum) => {
          setCurriculum(newCurriculum);
        }}
        practiceRecords={practiceRecords}
      />

      {/* Pupil Progress Dashboard Modal */}
      <PupilProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        pupilProfile={pupilProfile}
        onUpdatePupilProfile={handleUpdatePupilProfile}
        practiceRecords={practiceRecords}
      />

      {/* AI Teacher Assistant Modal (Cô Giáo Mai) */}
      <TeacherAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        context={assistantContext}
        initialQuestion={assistantInitialQuestion}
      />
    </div>
  );
}
