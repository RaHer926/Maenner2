import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import Survey from './components/Survey';
import Dashboard from './components/Dashboard';
import './App.css';

type View = 'home' | 'survey' | 'dashboard';

interface SurveyResult {
  id: string;
  patientName: string;
  completedAt: Date;
  answers: Record<string, number>;
  scores: Record<string, { score: number; maxScore: number; interpretation: string }>;
}

function AppWithAuth() {
  const { isAuthenticated, user, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const handleSurveyComplete = (answers: Record<string, number>) => {
    // Calculate scores
    const scores = calculateScores(answers);
    
    const result: SurveyResult = {
      id: Date.now().toString(),
      patientName: 'Demo Patient',
      completedAt: new Date(),
      answers,
      scores,
    };
    
    setSurveyResults(prev => [...prev, result]);
    setView('dashboard');
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
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Männergesundheit Fragebogen</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <button onClick={() => setView('survey')}>
              Neuen Fragebogen starten
            </button>
            <button onClick={() => setView('dashboard')}>
              Ergebnisse anzeigen
            </button>
          </div>
        </div>
      )}

      {view === 'survey' && (
        <Survey
          onComplete={handleSurveyComplete}
          onCancel={() => setView('home')}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          results={surveyResults}
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}

export default AppWithAuth;
