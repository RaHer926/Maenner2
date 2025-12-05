import { useState } from 'react'
import { useLanguage } from '../LanguageContext'
import './Survey.css'

interface SurveyProps {
  onComplete: (answers: Record<string, number>) => void
  onCancel: () => void
}

function Survey({ onComplete, onCancel }: SurveyProps) {
  const { t } = useLanguage()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  
  // Erstelle Sektionen aus Übersetzungen
  const sections = Object.keys(t.sections).map(key => ({
    id: key,
    title: t.sections[key as keyof typeof t.sections].title,
    questions: t.sections[key as keyof typeof t.sections].questions.map((text, index) => ({
      id: `${key}${index + 1}`,
      text,
    })),
  }))
  
  const section = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const isCurrentSectionComplete = () => {
    return section.questions.every(q => answers[q.id] !== undefined)
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
      window.scrollTo(0, 0)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="survey">
      <div className="survey-header">
        <h1>{t.surveyTitle}</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          {t.section} {currentSection + 1} {t.of} {sections.length}
        </p>
      </div>

      <div className="survey-content">
        <div className="section">
          <h2>{section.title}</h2>
          <p className="section-description">
            {t.sectionDescription}
          </p>

          <div className="questions">
            {section.questions.map((question, index) => (
              <div key={question.id} className="question">
                <div className="question-header">
                  <span className="question-number">{index + 1}.</span>
                  <p className="question-text">{question.text}</p>
                </div>
                
                {/* Bewertungsskala direkt bei jeder Frage */}
                <div className="question-scale-legend">
                 {(section.id === 'C' ? t.scaleLabelsC : t.scaleLabels).map((label, idx) => (
                    <div key={idx} className="question-scale-item">
                      <span className="question-scale-number">{idx + 1}</span>
                      <span className="question-scale-label">{label}</span>
                    </div>
                  ))}
                </div>
                
                <div className="answer-options">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      className={`answer-btn ${answers[question.id] === value ? 'selected' : ''}`}
                      onClick={() => handleAnswer(question.id, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="survey-navigation">
          <button
            className="btn btn-secondary"
            onClick={currentSection === 0 ? onCancel : handlePrevious}
          >
            {currentSection === 0 ? t.cancel : t.back}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
          >
            {currentSection === sections.length - 1 ? t.submit : t.next}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Survey

