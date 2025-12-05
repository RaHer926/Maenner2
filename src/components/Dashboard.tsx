import React from 'react'
import { useLanguage } from '../LanguageContext'
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

function Dashboard({ results, onBack }: DashboardProps) {
  const { t, language } = useLanguage()
  const [viewMode, setViewMode] = React.useState<ViewMode>('patient')
  const latestResult = results[results.length - 1]

  if (!latestResult) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>{t.dashboard}</h1>
          <button className="btn btn-secondary" onClick={onBack}>
            {t.backToHome}
          </button>
        </div>
        <div className="dashboard-content">
          <div className="empty-state">
            <h2>{t.noResults}</h2>
            <p>{t.noResultsMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  const getInterpretationColor = (interpretation: string) => {
    if (interpretation === 'Gut' || interpretation === 'Keine erektile Dysfunktion') return '#48bb78'
    if (interpretation === 'Leicht beeinträchtigt' || interpretation === 'Leichte ED') return '#ecc94b'
    if (interpretation === 'Mäßig beeinträchtigt' || interpretation === 'Leicht-mittelgradige ED' || interpretation === 'Mittelgradige ED') return '#ed8936'
    if (interpretation === 'Good' || interpretation === 'No Erectile Dysfunction') return '#48bb78'
    if (interpretation === 'Slightly Impaired' || interpretation === 'Mild ED') return '#ecc94b'
    if (interpretation === 'Moderately Impaired' || interpretation === 'Mild to Moderate ED' || interpretation === 'Moderate ED') return '#ed8936'
    return '#f56565'
  }

  const getRecommendations = (scores: Record<string, any>) => {
    const recommendations: string[] = []
    const inverseSections = ['B', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

    Object.entries(scores).forEach(([sectionId, data]) => {
      let percentage: number
      if (inverseSections.includes(sectionId)) {
        const minScore = sectionId === 'B' ? 7 : sectionId === 'D' ? 12 : sectionId === 'E' || sectionId === 'F' || sectionId === 'I' ? 6 : 5
        percentage = 100 - ((data.score - minScore) / (data.maxScore - minScore)) * 100
      } else {
        percentage = (data.score / data.maxScore) * 100
      }

      if (percentage < 60) {
        recommendations.push(t.recommendations[sectionId as keyof typeof t.recommendations])
      }
    })

    return recommendations
  }

  const recommendations = getRecommendations(latestResult.scores)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{t.dashboard} - {t.results}</h1>
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'patient' ? 'active' : ''}`}
              onClick={() => setViewMode('patient')}
            >
              {t.patientView}
            </button>
            <button
              className={`toggle-btn ${viewMode === 'doctor' ? 'active' : ''}`}
              onClick={() => setViewMode('doctor')}
            >
              {t.doctorView}
            </button>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          {t.backToHome}
        </button>
      </div>

      <div className="dashboard-content">
        <div className="result-card">
          <div className="result-header">
            <div>
              <h2>{latestResult.patientName}</h2>
              <p className="result-date">
                {t.completedOn}: {latestResult.completedAt.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
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
                    <h3>{t.sectionNames[sectionId as keyof typeof t.sectionNames]}</h3>
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
                      {data.score} / {data.maxScore} {t.points}
                    </span>
                    <span className="score-percentage">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {viewMode === 'patient' && (
            <div className="patient-info-box">
              <h3>{t.patientInfoTitle}</h3>
              <p>{t.patientInfoText}</p>
              <p>
                <strong>{t.patientInfoNextSteps}</strong> {t.patientInfoAction}
              </p>
            </div>
          )}

          {viewMode === 'doctor' && recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>{t.recommendationsTitle}</h3>
              <p className="recommendations-intro">
                {language === 'de' 
                  ? 'Basierend auf den Ergebnissen empfehlen wir folgende Nahrungsergänzungsmittel zur Unterstützung der Gesundheit:'
                  : 'Based on the results, we recommend the following supplements to support health:'}
              </p>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    {rec}
                  </div>
                ))}
              </div>
              <p className="recommendations-note">
                💡 <strong>{language === 'de' ? 'Hinweis:' : 'Note:'}</strong>{' '}
                {language === 'de' 
                  ? 'Diese Empfehlungen dienen nur zur Information. Bitte konsultieren Sie Ihren Arzt vor der Einnahme von Nahrungsergänzungsmitteln.'
                  : 'These recommendations are for informational purposes only. Please consult your doctor before taking any supplements.'}
              </p>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handlePrint}>
              🖨️ {language === 'de' ? 'Drucken' : 'Print'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
