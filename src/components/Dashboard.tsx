import React from 'react'
import './Dashboard.css'

interface SurveyResult {
  id: string
  patientName: string
  completedAt: Date
  answers: Record<string, number>
  scores: Record<string, { score: number; maxScore: number; interpretation: string }>
}

interface DashboardProps {
  results: SurveyResult[]
  onBack: () => void
}

type ViewMode = 'patient' | 'doctor'

const sectionNames: Record<string, string> = {
  B: 'Urogenitalsystem',
  C: 'Sexuelle Gesundheit',
  D: 'Hormonelle Gesundheit',
  E: 'Herz-Kreislauf',
  F: 'Stoffwechsel',
  G: 'Verdauung',
  H: 'Bewegungsapparat',
  I: 'Psyche',
  J: 'Lebensqualität',
}

function Dashboard({ results, onBack }: DashboardProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('patient')
  const latestResult = results[results.length - 1]

  if (!latestResult) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Zurück
          </button>
        </div>
        <div className="dashboard-content">
          <div className="empty-state">
            <h2>Keine Ergebnisse vorhanden</h2>
            <p>Füllen Sie zunächst einen Fragebogen aus.</p>
          </div>
        </div>
      </div>
    )
  }

  const getInterpretationColor = (interpretation: string) => {
    if (interpretation === 'Gut' || interpretation === 'Keine erektile Dysfunktion') return '#48bb78'
    if (interpretation === 'Leicht beeinträchtigt' || interpretation === 'Leichte ED') return '#ecc94b'
    if (interpretation === 'Mäßig beeinträchtigt' || interpretation === 'Leicht-mittelgradige ED' || interpretation === 'Mittelgradige ED') return '#ed8936'
    return '#f56565'
  }

  const getRecommendations = (scores: Record<string, any>) => {
    const recommendations: string[] = []
    
    // Definiere welche Sektionen invers sind
    const inverseSections = ['B', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

    Object.entries(scores).forEach(([sectionId, data]) => {
      // Berechne Prozentsatz basierend auf inverse/normal
      let percentage: number
      if (inverseSections.includes(sectionId)) {
        // Inverse: niedrige Punktzahl = gut, hohe Punktzahl = schlecht
        const minScore = sectionId === 'B' ? 7 : sectionId === 'D' ? 12 : sectionId === 'E' || sectionId === 'F' || sectionId === 'I' ? 6 : 5
        percentage = 100 - ((data.score - minScore) / (data.maxScore - minScore)) * 100
      } else {
        // Normal (nur C): hohe Punktzahl = gut
        percentage = (data.score / data.maxScore) * 100
      }

      if (percentage < 60) {
        switch (sectionId) {
          case 'B':
            recommendations.push('🔹 Prostata-Gesundheit: Sägepalme, Kürbiskernextrakt, Zink')
            break
          case 'C':
            recommendations.push('🔹 Sexuelle Gesundheit: L-Arginin, Maca, Tribulus Terrestris')
            break
          case 'D':
            recommendations.push('🔹 Hormonelle Balance: Vitamin D3, Zink, Magnesium, Ashwagandha')
            break
          case 'E':
            recommendations.push('🔹 Herz-Kreislauf: Omega-3, Coenzym Q10, Magnesium')
            break
          case 'F':
            recommendations.push('🔹 Stoffwechsel: Chrom, Alpha-Liponsäure, Berberin')
            break
          case 'G':
            recommendations.push('🔹 Verdauung: Probiotika, Enzyme, L-Glutamin')
            break
          case 'H':
            recommendations.push('🔹 Bewegungsapparat: Glucosamin, MSM, Kollagen')
            break
          case 'I':
            recommendations.push('🔹 Psyche: Omega-3, B-Vitamine, Magnesium, Rhodiola')
            break
          case 'J':
            recommendations.push('🔹 Vitalität: Multivitamin, Coenzym Q10, B-Komplex')
            break
        }
      }
    })

    return recommendations
  }

  const recommendations = getRecommendations(latestResult.scores)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard - Ergebnisse</h1>
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'patient' ? 'active' : ''}`}
              onClick={() => setViewMode('patient')}
            >
              👤 Patienten-Ansicht
            </button>
            <button
              className={`toggle-btn ${viewMode === 'doctor' ? 'active' : ''}`}
              onClick={() => setViewMode('doctor')}
            >
              🩺 Ärztliche Ansicht
            </button>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Zurück
        </button>
      </div>

      <div className="dashboard-content">
        <div className="result-card">
          <div className="result-header">
            <div>
              <h2>{latestResult.patientName}</h2>
              <p className="result-date">
                Ausgefüllt am: {latestResult.completedAt.toLocaleString('de-DE')}
              </p>
            </div>
          </div>

          <div className="scores-grid">
            {Object.entries(latestResult.scores).map(([sectionId, data]) => {
              const percentage = Math.round((data.score / data.maxScore) * 100)
              const color = getInterpretationColor(data.interpretation)

              return (
                <div key={sectionId} className="score-card">
                  <div className="score-header">
                    <h3>{sectionNames[sectionId]}</h3>
                    <span className="score-badge" style={{ background: color }}>
                      {data.interpretation}
                    </span>
                  </div>

                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{
                        width: `${percentage}%`,
                        background: color,
                      }}
                    ></div>
                  </div>

                  <div className="score-details">
                    <span className="score-value">
                      {data.score} / {data.maxScore} Punkte
                    </span>
                    <span className="score-percentage">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {viewMode === 'patient' && (
            <div className="patient-info-box">
              <h3>ℹ️ Hinweis für Patienten</h3>
              <p>
                Ihre Ergebnisse wurden erfolgreich erfasst. Ihr Arzt wird diese Auswertung
                mit Ihnen besprechen und gegebenenfalls Empfehlungen zur Verbesserung Ihrer
                Gesundheit geben.
              </p>
              <p>
                <strong>Nächste Schritte:</strong> Vereinbaren Sie einen Termin zur Besprechung
                der Ergebnisse mit Ihrem Arzt.
              </p>
            </div>
          )}

          {viewMode === 'doctor' && recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>🎯 Empfohlene Nahrungsergänzungsmittel</h3>
              <p className="recommendations-intro">
                Basierend auf Ihren Ergebnissen empfehlen wir folgende Nahrungsergänzungsmittel
                zur Unterstützung Ihrer Gesundheit:
              </p>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    {rec}
                  </div>
                ))}
              </div>
              <p className="recommendations-note">
                💡 <strong>Hinweis:</strong> Diese Empfehlungen dienen nur zur Information.
                Bitte konsultieren Sie Ihren Arzt vor der Einnahme von Nahrungsergänzungsmitteln.
              </p>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn btn-primary">📄 PDF exportieren</button>
            <button className="btn btn-secondary">📊 Detailansicht</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

