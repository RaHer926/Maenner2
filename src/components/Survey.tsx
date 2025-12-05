import { useState } from 'react'
import './Survey.css'

interface SurveyProps {
  onComplete: (answers: Record<string, number>) => void
  onCancel: () => void
}

const surveyData = {
  B: {
    title: 'B. Urogenitalsystem (Prostata, Blase, Harnwege)',
    questions: [
      { id: 'B1', text: 'Wie oft hatten Sie das Gefühl, dass Ihre Blase nach dem Wasserlassen nicht vollständig entleert war?' },
      { id: 'B2', text: 'Wie oft mussten Sie innerhalb von 2 Stunden ein zweites Mal Wasserlassen?' },
      { id: 'B3', text: 'Wie oft mussten Sie beim Wasserlassen mehrmals aufhören und wieder anfangen?' },
      { id: 'B4', text: 'Wie oft hatten Sie Schwierigkeiten, das Wasserlassen hinauszuzögern?' },
      { id: 'B5', text: 'Wie oft hatten Sie einen schwachen Harnstrahl?' },
      { id: 'B6', text: 'Wie oft mussten Sie pressen oder sich anstrengen, um mit dem Wasserlassen zu beginnen?' },
      { id: 'B7', text: 'Wie oft sind Sie im Durchschnitt nachts aufgestanden, um Wasser zu lassen?' },
    ],
  },
  C: {
    title: 'C. Sexuelle Gesundheit und Funktion (IIEF-5)',
    questions: [
      { id: 'C1', text: 'Wie würden Sie Ihr Vertrauen bewerten, eine Erektion zu bekommen und zu halten? (1=sehr niedrig, 5=sehr hoch)' },
      { id: 'C2', text: 'Wenn Sie bei sexueller Stimulation Erektionen hatten, wie oft waren Ihre Erektionen hart genug für eine Penetration? (1=fast nie/nie, 5=fast immer/immer)' },
      { id: 'C3', text: 'Während des Geschlechtsverkehrs, wie oft konnten Sie die Erektion aufrechterhalten, nachdem Sie in Ihre Partnerin eingedrungen waren? (1=fast nie/nie, 5=fast immer/immer)' },
      { id: 'C4', text: 'Während des Geschlechtsverkehrs, wie schwierig war es, die Erektion bis zum Ende aufrechtzuerhalten? (1=extrem schwierig, 5=nicht schwierig)' },
      { id: 'C5', text: 'Wenn Sie Geschlechtsverkehr versuchten, wie oft war dieser für Sie befriedigend? (1=fast nie/nie, 5=fast immer/immer)' },
      { id: 'C6', text: 'Wie zufrieden sind Sie mit Ihrem Sexualleben insgesamt? (1=sehr unzufrieden, 5=sehr zufrieden)' },
    ],
  },
  D: {
    title: 'D. Hormonelle Gesundheit (Testosteron, Energie, Stimmung)',
    questions: [
      { id: 'D1', text: 'Haben Sie einen Rückgang Ihres Leistungsgefühls bemerkt?' },
      { id: 'D2', text: 'Haben Sie einen Verlust an Körpergröße bemerkt?' },
      { id: 'D3', text: 'Haben Sie eine Abnahme Ihrer Lebensfreude bemerkt?' },
      { id: 'D4', text: 'Sind Sie traurig und/oder mürrisch?' },
      { id: 'D5', text: 'Sind Ihre Erektionen weniger stark?' },
      { id: 'D6', text: 'Haben Sie eine Verschlechterung Ihrer sportlichen Leistungsfähigkeit bemerkt?' },
      { id: 'D7', text: 'Schlafen Sie nach dem Abendessen ein?' },
      { id: 'D8', text: 'Hat sich Ihre Arbeitsfähigkeit verschlechtert?' },
      { id: 'D9', text: 'Haben Sie einen Verlust des sexuellen Verlangens bemerkt?' },
      { id: 'D10', text: 'Haben Sie in letzter Zeit an Muskelmasse verloren?' },
      { id: 'D11', text: 'Fühlen Sie sich häufig erschöpft oder müde?' },
      { id: 'D12', text: 'Haben Sie Hitzewallungen oder vermehrtes Schwitzen bemerkt?' },
    ],
  },
  E: {
    title: 'E. Herz-Kreislauf-System',
    questions: [
      { id: 'E1', text: 'Wie häufig leiden Sie unter Kurzatmigkeit bei körperlicher Anstrengung?' },
      { id: 'E2', text: 'Wie oft haben Sie Brustschmerzen oder ein Engegefühl in der Brust?' },
      { id: 'E3', text: 'Wie häufig bemerken Sie Herzrasen oder unregelmäßigen Herzschlag?' },
      { id: 'E4', text: 'Wie oft haben Sie Schwellungen in den Beinen oder Knöcheln?' },
      { id: 'E5', text: 'Wie häufig fühlen Sie sich schwindelig oder benommen?' },
      { id: 'E6', text: 'Wie würden Sie Ihre körperliche Ausdauer und Belastbarkeit bewerten?' },
    ],
  },
  F: {
    title: 'F. Stoffwechsel und Gewicht',
    questions: [
      { id: 'F1', text: 'Wie zufrieden sind Sie mit Ihrem aktuellen Körpergewicht?' },
      { id: 'F2', text: 'Wie häufig haben Sie übermäßigen Durst?' },
      { id: 'F3', text: 'Wie oft müssen Sie häufiger als normal urinieren (außerhalb der Nacht)?' },
      { id: 'F4', text: 'Wie häufig fühlen Sie sich nach dem Essen ungewöhnlich müde?' },
      { id: 'F5', text: 'Wie schwierig ist es für Sie, Ihr Gewicht zu halten oder abzunehmen?' },
      { id: 'F6', text: 'Wie würden Sie Ihr Energieniveau im Alltag bewerten?' },
    ],
  },
  G: {
    title: 'G. Verdauungssystem',
    questions: [
      { id: 'G1', text: 'Wie häufig leiden Sie unter Sodbrennen oder saurem Aufstoßen?' },
      { id: 'G2', text: 'Wie oft haben Sie Bauchschmerzen oder Krämpfe?' },
      { id: 'G3', text: 'Wie häufig leiden Sie unter Blähungen oder Völlegefühl?' },
      { id: 'G4', text: 'Wie regelmäßig ist Ihr Stuhlgang?' },
      { id: 'G5', text: 'Wie zufrieden sind Sie mit Ihrer Verdauung insgesamt?' },
    ],
  },
  H: {
    title: 'H. Bewegungsapparat (Knochen, Gelenke, Muskeln)',
    questions: [
      { id: 'H1', text: 'Wie häufig haben Sie Rückenschmerzen?' },
      { id: 'H2', text: 'Wie oft leiden Sie unter Gelenkschmerzen oder Steifheit?' },
      { id: 'H3', text: 'Wie häufig haben Sie Muskelverspannungen oder Muskelschmerzen?' },
      { id: 'H4', text: 'Wie würden Sie Ihre allgemeine Beweglichkeit bewerten?' },
      { id: 'H5', text: 'Wie stark beeinträchtigen Schmerzen Ihre täglichen Aktivitäten?' },
    ],
  },
  I: {
    title: 'I. Psychisches Wohlbefinden',
    questions: [
      { id: 'I1', text: 'Wie häufig fühlen Sie sich niedergeschlagen oder deprimiert?' },
      { id: 'I2', text: 'Wie oft haben Sie Schwierigkeiten, sich zu konzentrieren?' },
      { id: 'I3', text: 'Wie häufig fühlen Sie sich ängstlich oder nervös?' },
      { id: 'I4', text: 'Wie würden Sie die Qualität Ihres Schlafes bewerten?' },
      { id: 'I5', text: 'Wie oft haben Sie Schwierigkeiten, einzuschlafen oder durchzuschlafen?' },
      { id: 'I6', text: 'Wie würden Sie Ihre Stressbelastung im Alltag bewerten?' },
    ],
  },
  J: {
    title: 'J. Allgemeine Vitalität und Lebensqualität',
    questions: [
      { id: 'J1', text: 'Wie würden Sie Ihren allgemeinen Gesundheitszustand bewerten?' },
      { id: 'J2', text: 'Wie zufrieden sind Sie mit Ihrer körperlichen Fitness?' },
      { id: 'J3', text: 'Wie würden Sie Ihre Lebensqualität insgesamt bewerten?' },
      { id: 'J4', text: 'Wie oft fühlen Sie sich voller Energie und Tatendrang?' },
      { id: 'J5', text: 'Wie zufrieden sind Sie mit Ihrer Work-Life-Balance?' },
    ],
  },
}

const scaleLabels = [
  '1 - Nie / Sehr gut',
  '2 - Selten / Gut',
  '3 - Manchmal / Mittel',
  '4 - Oft / Schlecht',
  '5 - Immer / Sehr schlecht',
]

function Survey({ onComplete, onCancel }: SurveyProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  
  const sections = Object.entries(surveyData)
  const [, section] = sections[currentSection]
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
        <h1>Männergesundheit Fragebogen</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Sektion {currentSection + 1} von {sections.length}
        </p>
      </div>

      <div className="survey-content">
        <div className="section">
          <h2>{section.title}</h2>
          <p className="section-description">
            Bitte bewerten Sie jede Frage auf einer Skala von 1 bis 5 basierend auf Ihren Erfahrungen in den letzten 4 Wochen.
          </p>

          <div className="scale-legend">
            {scaleLabels.map((label, index) => (
              <div key={index} className="scale-item">
                <span className="scale-number">{index + 1}</span>
                <span className="scale-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="questions">
            {section.questions.map((question, index) => (
              <div key={question.id} className="question">
                <div className="question-header">
                  <span className="question-number">{index + 1}.</span>
                  <p className="question-text">{question.text}</p>
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
            {currentSection === 0 ? '← Abbrechen' : '← Zurück'}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
          >
            {currentSection === sections.length - 1 ? 'Abschließen ✓' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Survey

