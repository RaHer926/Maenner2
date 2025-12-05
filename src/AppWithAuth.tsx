import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './LanguageContext';
import { Login } from './components/Login';
import LanguageToggle from './components/LanguageToggle';
import { PatientManagement } from './components/PatientManagement';
import { DoctorDashboard } from './components/DoctorDashboard';
import Survey from './components/Survey';
import { trpc } from './lib/trpc';
import './App.css';

type View = 'home' | 'patients' | 'survey' | 'dashboard';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  patientNumber?: string;
}

function AppWithAuth() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [view, setView] = useState<View>('home');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const createSurvey = trpc.surveys.create.useMutation({
    onSuccess: () => {
      setView('dashboard');
    },
  });

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setView('survey');
  };

  const handleSurveyComplete = (answers: Record<string, number>) => {
    if (!selectedPatient) return;

    // Calculate scores
    const scores = calculateScores(answers);
    
    // Calculate total score
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);

    // Save to database
    createSurvey.mutate({
      patientId: selectedPatient.id,
      language: 'de',
      answers,
      scores,
      totalScore,
    });


  };

  const calculateScores = (answers: Record<string, number>) => {
    const sections = {
      B: { name: 'Urogenitalsystem', questions: 7, inverse: true },
      C: { name: 'Sexuelle Gesundheit', questions: 6, inverse: false },
      D: { name: 'Hormonelle Gesundheit', questions: 12, inverse: true },
      E: { name: 'Herz-Kreislauf', questions: 6, inverse: true },
      F: { name: 'Stoffwechsel', questions: 6, inverse: true },
      G: { name: 'Verdauung', questions: 5, inverse: true },
      H: { name: 'Bewegungsapparat', questions: 5, inverse: true },
      I: { name: 'Psyche', questions: 6, inverse: true },
      J: { name: 'Lebensqualität', questions: 5, inverse: true },
    };

    const scores: Record<string, { score: number; maxScore: number; interpretation: string }> = {};

    Object.entries(sections).forEach(([sectionKey, sectionInfo]) => {
      let sectionScore = 0;
      let questionCount = 0;

      Object.entries(answers).forEach(([questionId, value]) => {
        if (questionId.startsWith(sectionKey)) {
          questionCount++;
          if (sectionInfo.inverse) {
            sectionScore += (6 - value);
          } else {
            sectionScore += value;
          }
        }
      });

      const maxScore = sectionInfo.questions * 5;
      const percentage = (sectionScore / maxScore) * 100;

      let interpretation = '';
      if (sectionKey === 'C') {
        // IIEF-5 standard scoring
        if (sectionScore >= 22) interpretation = 'Keine erektile Dysfunktion';
        else if (sectionScore >= 17) interpretation = 'Leichte erektile Dysfunktion';
        else if (sectionScore >= 12) interpretation = 'Leicht bis moderate erektile Dysfunktion';
        else if (sectionScore >= 8) interpretation = 'Moderate erektile Dysfunktion';
        else interpretation = 'Schwere erektile Dysfunktion';
      } else {
        // Inverse scoring interpretation
        if (percentage >= 80) interpretation = 'Sehr gut';
        else if (percentage >= 60) interpretation = 'Gut';
        else if (percentage >= 40) interpretation = 'Mäßig';
        else if (percentage >= 20) interpretation = 'Bedenklich';
        else interpretation = 'Kritisch';
      }

      scores[sectionKey] = {
        score: sectionScore,
        maxScore,
        interpretation,
      };
    });

    return scores;
  };

  return (
    <div className="app">
      {/* Header with logout */}
      <div style={{
        padding: '1rem',
        background: '#667eea',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{t.appTitle}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageToggle />
          <span>{user?.name}</span>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Main content */}
      {view === 'home' && (
        <div className="home">
          <h2>Willkommen</h2>
          <div className="button-group">
            <button onClick={() => setView('patients')}>
              Patienten verwalten
            </button>
            <button onClick={() => setView('dashboard')}>
              Ergebnisse anzeigen
            </button>
          </div>
        </div>
      )}

      {view === 'patients' && (
        <PatientManagement
          onSelectPatient={handlePatientSelect}
          onBack={() => setView('home')}
        />
      )}

      {view === 'survey' && selectedPatient && (
        <Survey
          onComplete={handleSurveyComplete}
          onCancel={() => {
            setSelectedPatient(null);
            setView('patients');
          }}
        />
      )}

      {view === 'dashboard' && (
        <DoctorDashboard
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}

export default AppWithAuth;
