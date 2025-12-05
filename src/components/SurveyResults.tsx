import React, { useState } from 'react';
import RecommendationPanel from './RecommendationPanel';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  patientNumber?: string;
}

interface SurveyResultsProps {
  patient: Patient;
  surveyId?: number;
  scores: Record<string, { score: number; maxScore: number; interpretation: string }>;
  totalScore: number;
  onContinue: () => void;
  language?: 'de' | 'en';
}

const SurveyResults: React.FC<SurveyResultsProps> = ({
  patient,
  surveyId,
  scores,
  totalScore,
  onContinue,
  language = 'de',
}) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const translations = {
    de: {
      title: 'Fragebogen-Ergebnisse',
      subtitle: 'Auswertung des Gesundheitsfragebogens',
      patientInfo: 'Patient',
      completedAt: 'Abgeschlossen am',
      totalScore: 'Gesamtpunktzahl',
      healthAreas: 'Gesundheitsbereiche',
      score: 'Punkte',
      interpretation: 'Bewertung',
      continue: 'Zum Dashboard',
      print: 'Drucken',
      recommendations: 'Empfehlungen anzeigen',
      hideRecommendations: 'Empfehlungen ausblenden',
      sections: {
        B: 'Urogenitalsystem',
        C: 'Sexuelle Gesundheit',
        D: 'Hormonelle Gesundheit',
        E: 'Herz-Kreislauf-System',
        F: 'Stoffwechsel',
        G: 'Verdauungssystem',
        H: 'Bewegungsapparat',
        I: 'Psychische Gesundheit',
        J: 'Lebensqualität',
      },
    },
    en: {
      title: 'Survey Results',
      subtitle: 'Health Questionnaire Evaluation',
      patientInfo: 'Patient',
      completedAt: 'Completed on',
      totalScore: 'Total Score',
      healthAreas: 'Health Areas',
      score: 'Score',
      interpretation: 'Interpretation',
      continue: 'Go to Dashboard',
      print: 'Print',
      recommendations: 'Show Recommendations',
      hideRecommendations: 'Hide Recommendations',
      sections: {
        B: 'Urogenital System',
        C: 'Sexual Health',
        D: 'Hormonal Health',
        E: 'Cardiovascular System',
        F: 'Metabolism',
        G: 'Digestive System',
        H: 'Musculoskeletal System',
        I: 'Mental Health',
        J: 'Quality of Life',
      },
    },
  };

  const t = translations[language];

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getInterpretationColor = (interpretation: string) => {
    if (interpretation.includes('Sehr gut') || interpretation.includes('Keine')) return 'text-green-700 bg-green-50';
    if (interpretation.includes('Gut') || interpretation.includes('Leichte')) return 'text-blue-700 bg-blue-50';
    if (interpretation.includes('Mäßig') || interpretation.includes('moderate')) return 'text-yellow-700 bg-yellow-50';
    if (interpretation.includes('Bedenklich') || interpretation.includes('Moderate')) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Patient Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t.patientInfo}</p>
            <p className="text-lg font-semibold text-gray-900">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t.completedAt}</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Total Score */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">{t.totalScore}</h2>
        <p className="text-4xl font-bold">{totalScore} / {Object.values(scores).reduce((sum, s) => sum + s.maxScore, 0)}</p>
      </div>

      {/* Health Areas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.healthAreas}</h2>
        <div className="space-y-6">
          {Object.entries(scores).map(([sectionKey, sectionData]) => {
            const percentage = (sectionData.score / sectionData.maxScore) * 100;
            const sectionName = t.sections[sectionKey as keyof typeof t.sections] || sectionKey;

            return (
              <div key={sectionKey} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{sectionName}</h3>
                  <span className="text-sm font-medium text-gray-600">
                    {sectionData.score} / {sectionData.maxScore} {t.score}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Interpretation */}
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getInterpretationColor(sectionData.interpretation)}`}>
                  {sectionData.interpretation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations Section */}
      {surveyId && (
        <div className="mb-8">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {showRecommendations ? t.hideRecommendations : t.recommendations}
          </button>
          {showRecommendations && (
            <div className="mt-4">
              <RecommendationPanel surveyId={surveyId} language={language} />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          {t.print}
        </button>
        <button
          onClick={onContinue}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t.continue}
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyResults;
