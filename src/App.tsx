import { useState } from 'react'
import Survey from './components/Survey'
import Dashboard from './components/Dashboard'
import './App.css'

type View = 'home' | 'survey' | 'dashboard'

interface SurveyResult {
  id: string
  patientName: string
  completedAt: Date
  answers: Record<string, number>
  scores: Record<string, { score: number; maxScore: number; interpretation: string }>
}

function App() {
  const [view, setView] = useState<View>('home')
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([])

  const handleSurveyComplete = (answers: Record<string, number>) => {
    // Berechne Scores
    const scores = calculateScores(answers)
    
    const result: SurveyResult = {
      id: Date.now().toString(),
      patientName: 'Demo Patient',
      completedAt: new Date(),
      answers,
      scores,
    }
    
    setSurveyResults(prev => [...prev, result])
    setView('dashboard')
  }

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
    }

    const scores: Record<string, { score: number; maxScore: number; interpretation: string }> = {}

    Object.entries(sections).forEach(([sectionId, section]) => {
      const sectionAnswers = Object.entries(answers).filter(([key]) => key.startsWith(sectionId))
      
      // Alle Fragen normal berechnen (keine Invertierung)
      const score = sectionAnswers.reduce((sum, [, value]) => sum + value, 0)
      
      const maxScore = section.questions * 5
      
      // Für inverse Sektionen: niedrige Punktzahl = gut
      // Für normale Sektionen (nur C): hohe Punktzahl = gut
      let percentage: number
      if (section.inverse) {
        // Invertiere die Prozentberechnung
        percentage = 100 - ((score - section.questions) / (maxScore - section.questions)) * 100
      } else {
        // Normale Berechnung (höhere Punktzahl = besser)
        percentage = (score / maxScore) * 100
      }

      let interpretation = 'Gut'
      
      // Spezielle Interpretation für Sektion C (IIEF-5)
      if (sectionId === 'C') {
        // IIEF-5 Scoring (5-25 Punkte)
        if (score >= 22) interpretation = 'Keine erektile Dysfunktion'
        else if (score >= 17) interpretation = 'Leichte ED'
        else if (score >= 12) interpretation = 'Leicht-mittelgradige ED'
        else if (score >= 8) interpretation = 'Mittelgradige ED'
        else interpretation = 'Schwere ED'
      } else {
        // Standard-Interpretation für andere Sektionen
        if (percentage < 40) interpretation = 'Schwer beeinträchtigt'
        else if (percentage < 60) interpretation = 'Mäßig beeinträchtigt'
        else if (percentage < 80) interpretation = 'Leicht beeinträchtigt'
      }

      scores[sectionId] = { score, maxScore, interpretation }
    })

    return scores
  }

  return (
    <div className="app">
      {view === 'home' && (
        <div className="home">
          <div className="home-container">
            <h1>Männergesundheit Fragebogen</h1>
            <p className="subtitle">Demo-Version</p>
            
            <div className="home-content">
              <div className="info-box">
                <h2>Willkommen zur Demo</h2>
                <p>
                  Diese Demo zeigt die vollständige Funktionalität des Männergesundheit-Fragebogens
                  für urologische und andrologische Diagnostik.
                </p>
                
                <h3>Funktionen:</h3>
                <ul>
                  <li>✅ Umfassender Fragebogen (9 Sektionen, 58 Fragen)</li>
                  <li>✅ Responsive Design (Mobile, Tablet, Desktop)</li>
                  <li>✅ Automatische Score-Berechnung</li>
                  <li>✅ Visuelle Ergebnisdarstellung</li>
                  <li>✅ Dashboard für Praxispersonal</li>
                </ul>
              </div>

              <div className="button-group">
                <button className="btn btn-primary" onClick={() => setView('survey')}>
                  📋 Fragebogen ausfüllen
                </button>
                <button className="btn btn-secondary" onClick={() => setView('dashboard')}>
                  📊 Dashboard ansehen
                </button>
              </div>
            </div>
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
  )
}

export default App

