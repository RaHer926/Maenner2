// Vollständige Übersetzungen für die Männergesundheit Fragebogen App

export const translations = {
  de: {
    // Allgemein
    appTitle: 'Männergesundheit Fragebogen',
    subtitle: 'Umfassende Gesundheitserfassung',
    demoVersion: 'Demo-Version',
    
    // Startseite
    welcome: 'Willkommen',
    welcomeMessage: 'Erfassen Sie Ihre Gesundheit in 9 Bereichen',
    startSurvey: 'Fragebogen ausfüllen',
    viewDashboard: 'Dashboard ansehen',
    
    // Fragebogen
    surveyTitle: 'Männergesundheit Fragebogen',
    section: 'Sektion',
    of: 'von',
    sectionDescription: 'Bitte bewerten Sie jede Frage auf einer Skala von 1 bis 5 basierend auf Ihren Erfahrungen in den letzten 4 Wochen.',
    
    // Navigation
    next: 'Weiter →',
    back: '← Zurück',
    cancel: '← Abbrechen',
    submit: 'Abschließen ✓',
    backToHome: '← Zurück',
    
    // Skala-Labels
    scaleLabels: [
      '1 - Nie / Sehr gut',
      '2 - Selten / Gut',
      '3 - Manchmal / Mittel',
      '4 - Oft / Schlecht',
      '5 - Immer / Sehr schlecht',
    ],
scaleLabelsC: [
  'Sehr niedrig',
  'Selten',
  'Manchmal',
  'Oft',
  'Immer',
],   
    // Sektions-Titel
    sections: {
      B: {
        title: 'B. Urogenitalsystem (Prostata, Blase, Harnwege)',
        questions: [
          'Wie oft hatten Sie das Gefühl, dass Ihre Blase nach dem Wasserlassen nicht vollständig entleert war?',
          'Wie oft mussten Sie innerhalb von 2 Stunden ein zweites Mal Wasserlassen?',
          'Wie oft mussten Sie beim Wasserlassen mehrmals aufhören und wieder anfangen?',
          'Wie oft hatten Sie Schwierigkeiten, das Wasserlassen hinauszuzögern?',
          'Wie oft hatten Sie einen schwachen Harnstrahl?',
          'Wie oft mussten Sie pressen oder sich anstrengen, um mit dem Wasserlassen zu beginnen?',
          'Wie oft sind Sie im Durchschnitt nachts aufgestanden, um Wasser zu lassen?',
        ],
      },
      C: {
        title: 'C. Sexuelle Gesundheit und Funktion (IIEF-5)',
        questions: [
          'Wie würden Sie Ihr Vertrauen bewerten, eine Erektion zu bekommen und zu halten? (1=sehr niedrig, 5=sehr hoch)',
          'Wenn Sie bei sexueller Stimulation Erektionen hatten, wie oft waren Ihre Erektionen hart genug für eine Penetration? (1=fast nie/nie, 5=fast immer/immer)',
          'Während des Geschlechtsverkehrs, wie oft konnten Sie die Erektion aufrechterhalten, nachdem Sie in Ihre Partnerin eingedrungen waren? (1=fast nie/nie, 5=fast immer/immer)',
          'Während des Geschlechtsverkehrs, wie schwierig war es, die Erektion bis zum Ende aufrechtzuerhalten? (1=extrem schwierig, 5=nicht schwierig)',
          'Wenn Sie Geschlechtsverkehr versuchten, wie oft war dieser für Sie befriedigend? (1=fast nie/nie, 5=fast immer/immer)',
          'Wie zufrieden sind Sie mit Ihrem Sexualleben insgesamt? (1=sehr unzufrieden, 5=sehr zufrieden)',
        ],
      },
      D: {
        title: 'D. Hormonelle Gesundheit (Testosteron, Energie, Stimmung)',
        questions: [
          'Haben Sie einen Rückgang Ihres Leistungsgefühls bemerkt?',
          'Haben Sie einen Verlust an Körpergröße bemerkt?',
          'Haben Sie eine Abnahme Ihrer Lebensfreude bemerkt?',
          'Sind Sie traurig und/oder mürrisch?',
          'Sind Ihre Erektionen weniger stark?',
          'Haben Sie eine Verschlechterung Ihrer sportlichen Leistungsfähigkeit bemerkt?',
          'Schlafen Sie nach dem Abendessen ein?',
          'Hat sich Ihre Arbeitsfähigkeit verschlechtert?',
          'Haben Sie einen Verlust des sexuellen Verlangens bemerkt?',
          'Haben Sie in letzter Zeit an Muskelmasse verloren?',
          'Fühlen Sie sich häufig erschöpft oder müde?',
          'Haben Sie Hitzewallungen oder vermehrtes Schwitzen bemerkt?',
        ],
      },
      E: {
        title: 'E. Herz-Kreislauf-System',
        questions: [
          'Wie häufig leiden Sie unter Kurzatmigkeit bei körperlicher Anstrengung?',
          'Wie oft haben Sie Brustschmerzen oder ein Engegefühl in der Brust?',
          'Wie häufig bemerken Sie Herzrasen oder unregelmäßigen Herzschlag?',
          'Wie oft haben Sie Schwellungen in den Beinen oder Knöcheln?',
          'Wie häufig fühlen Sie sich schwindelig oder benommen?',
          'Wie würden Sie Ihre körperliche Ausdauer und Belastbarkeit bewerten?',
        ],
      },
      F: {
        title: 'F. Stoffwechsel und Gewicht',
        questions: [
          'Wie zufrieden sind Sie mit Ihrem aktuellen Körpergewicht?',
          'Wie häufig haben Sie übermäßigen Durst?',
          'Wie oft müssen Sie häufiger als normal urinieren (außerhalb der Nacht)?',
          'Wie häufig fühlen Sie sich nach dem Essen ungewöhnlich müde?',
          'Wie schwierig ist es für Sie, Ihr Gewicht zu halten oder abzunehmen?',
          'Wie würden Sie Ihr Energieniveau im Alltag bewerten?',
        ],
      },
      G: {
        title: 'G. Verdauungssystem',
        questions: [
          'Wie häufig leiden Sie unter Sodbrennen oder saurem Aufstoßen?',
          'Wie oft haben Sie Bauchschmerzen oder Krämpfe?',
          'Wie häufig leiden Sie unter Blähungen oder Völlegefühl?',
          'Wie regelmäßig ist Ihr Stuhlgang?',
          'Wie zufrieden sind Sie mit Ihrer Verdauung insgesamt?',
        ],
      },
      H: {
        title: 'H. Bewegungsapparat (Knochen, Gelenke, Muskeln)',
        questions: [
          'Wie häufig haben Sie Rückenschmerzen?',
          'Wie oft leiden Sie unter Gelenkschmerzen oder Steifheit?',
          'Wie häufig haben Sie Muskelverspannungen oder Muskelschmerzen?',
          'Wie würden Sie Ihre allgemeine Beweglichkeit bewerten?',
          'Wie stark beeinträchtigen Schmerzen Ihre täglichen Aktivitäten?',
        ],
      },
      I: {
        title: 'I. Psychisches Wohlbefinden',
        questions: [
          'Wie häufig fühlen Sie sich niedergeschlagen oder deprimiert?',
          'Wie oft haben Sie Schwierigkeiten, sich zu konzentrieren?',
          'Wie häufig fühlen Sie sich ängstlich oder nervös?',
          'Wie würden Sie die Qualität Ihres Schlafes bewerten?',
          'Wie oft haben Sie Schwierigkeiten, einzuschlafen oder durchzuschlafen?',
          'Wie würden Sie Ihre Stressbelastung im Alltag bewerten?',
        ],
      },
      J: {
        title: 'J. Allgemeine Vitalität und Lebensqualität',
        questions: [
          'Wie würden Sie Ihren allgemeinen Gesundheitszustand bewerten?',
          'Wie zufrieden sind Sie mit Ihrer körperlichen Fitness?',
          'Wie würden Sie Ihre Lebensqualität insgesamt bewerten?',
          'Wie oft fühlen Sie sich voller Energie und Tatendrang?',
          'Wie zufrieden sind Sie mit Ihrer Work-Life-Balance?',
        ],
      },
    },
    
    // Dashboard
    dashboard: 'Dashboard',
    results: 'Ergebnisse',
    patientView: '👤 Patienten-Ansicht',
    doctorView: '🩺 Ärztliche Ansicht',
    completedOn: 'Ausgefüllt am',
    points: 'Punkte',
    noResults: 'Keine Ergebnisse vorhanden',
    noResultsMessage: 'Füllen Sie zunächst einen Fragebogen aus.',
    
    // Sektionsnamen (kurz)
    sectionNames: {
      B: 'Urogenitalsystem',
      C: 'Sexuelle Gesundheit',
      D: 'Hormonelle Gesundheit',
      E: 'Herz-Kreislauf',
      F: 'Stoffwechsel',
      G: 'Verdauung',
      H: 'Bewegungsapparat',
      I: 'Psyche',
      J: 'Lebensqualität',
    },
    
    // Interpretationen
    interpretations: {
      good: 'Gut',
      slightlyImpaired: 'Leicht beeinträchtigt',
      moderatelyImpaired: 'Mäßig beeinträchtigt',
      severelyImpaired: 'Schwer beeinträchtigt',
      noED: 'Keine erektile Dysfunktion',
      mildED: 'Leichte ED',
      mildModerateED: 'Leicht-mittelgradige ED',
      moderateED: 'Mittelgradige ED',
      severeED: 'Schwere ED',
    },
    
    // Patienten-Info
    patientInfoTitle: 'ℹ️ Hinweis für Patienten',
    patientInfoText: 'Ihre Ergebnisse wurden erfolgreich erfasst. Ihr Arzt wird diese Auswertung mit Ihnen besprechen und gegebenenfalls Empfehlungen zur Verbesserung Ihrer Gesundheit geben.',
    patientInfoNextSteps: 'Nächste Schritte:',
    patientInfoAction: 'Vereinbaren Sie einen Termin zur Besprechung der Ergebnisse mit Ihrem Arzt.',
    
    // Empfehlungen
    recommendationsTitle: '💊 Empfohlene Nahrungsergänzungsmittel',
    recommendations: {
      B: '🔹 Prostata-Gesundheit: Sägepalme, Kürbiskernextrakt, Zink',
      C: '🔹 Sexuelle Gesundheit: L-Arginin, Maca, Tribulus Terrestris',
      D: '🔹 Hormonelle Balance: Vitamin D3, Zink, Magnesium, Ashwagandha',
      E: '🔹 Herz-Kreislauf: Omega-3, Coenzym Q10, Magnesium',
      F: '🔹 Stoffwechsel: Chrom, Alpha-Liponsäure, Berberin',
      G: '🔹 Verdauung: Probiotika, Enzyme, L-Glutamin',
      H: '🔹 Bewegungsapparat: Glucosamin, MSM, Kollagen',
      I: '🔹 Psyche: Omega-3, B-Vitamine, Magnesium, Rhodiola',
      J: '🔹 Vitalität: Multivitamin, Coenzym Q10, B-Komplex',
    },
  },
  
  en: {
    // General
    appTitle: 'Men\'s Health Questionnaire',
    subtitle: 'Comprehensive Health Assessment',
    demoVersion: 'Demo Version',
    
    // Homepage
    welcome: 'Welcome',
    welcomeMessage: 'Assess your health across 9 areas',
    startSurvey: 'Start Questionnaire',
    viewDashboard: 'View Dashboard',
    
    // Survey
    surveyTitle: 'Men\'s Health Questionnaire',
    section: 'Section',
    of: 'of',
    sectionDescription: 'Please rate each question on a scale of 1 to 5 based on your experiences over the past 4 weeks.',
    
    // Navigation
    next: 'Next →',
    back: '← Back',
    cancel: '← Cancel',
    submit: 'Complete ✓',
    backToHome: '← Back',
    
    // Scale Labels
    scaleLabels: [
      '1 - Never / Very good',
      '2 - Rarely / Good',
      '3 - Sometimes / Moderate',
      '4 - Often / Poor',
      '5 - Always / Very poor',
    ],
scaleLabelsC: [
  'Very Low',
  'Rarely',
  'Sometimes',
  'Often',
  'Always',
],    
    // Section Titles
    sections: {
      B: {
        title: 'B. Urogenital System (Prostate, Bladder, Urinary Tract)',
        questions: [
          'How often have you had the sensation that your bladder was not completely empty after urinating?',
          'How often did you have to urinate again within 2 hours?',
          'How often did you have to stop and start again several times when urinating?',
          'How often did you find it difficult to postpone urination?',
          'How often have you had a weak urinary stream?',
          'How often did you have to push or strain to begin urination?',
          'How many times on average did you get up at night to urinate?',
        ],
      },
      C: {
        title: 'C. Sexual Health and Function (IIEF-5)',
        questions: [
          'How would you rate your confidence in getting and keeping an erection? (1=very low, 5=very high)',
          'When you had erections with sexual stimulation, how often were your erections hard enough for penetration? (1=almost never/never, 5=almost always/always)',
          'During sexual intercourse, how often were you able to maintain your erection after penetration? (1=almost never/never, 5=almost always/always)',
          'During sexual intercourse, how difficult was it to maintain your erection to completion? (1=extremely difficult, 5=not difficult)',
          'When you attempted sexual intercourse, how often was it satisfactory for you? (1=almost never/never, 5=almost always/always)',
          'How satisfied are you with your sex life overall? (1=very dissatisfied, 5=very satisfied)',
        ],
      },
      D: {
        title: 'D. Hormonal Health (Testosterone, Energy, Mood)',
        questions: [
          'Have you noticed a decline in your feeling of performance?',
          'Have you noticed a loss of body height?',
          'Have you noticed a decrease in your enjoyment of life?',
          'Are you sad and/or grumpy?',
          'Are your erections less strong?',
          'Have you noticed a deterioration in your athletic performance?',
          'Do you fall asleep after dinner?',
          'Has your work ability deteriorated?',
          'Have you noticed a loss of sexual desire?',
          'Have you recently lost muscle mass?',
          'Do you frequently feel exhausted or tired?',
          'Have you noticed hot flashes or increased sweating?',
        ],
      },
      E: {
        title: 'E. Cardiovascular System',
        questions: [
          'How often do you suffer from shortness of breath during physical exertion?',
          'How often do you have chest pain or tightness in the chest?',
          'How often do you notice heart palpitations or irregular heartbeat?',
          'How often do you have swelling in your legs or ankles?',
          'How often do you feel dizzy or lightheaded?',
          'How would you rate your physical endurance and resilience?',
        ],
      },
      F: {
        title: 'F. Metabolism and Weight',
        questions: [
          'How satisfied are you with your current body weight?',
          'How often do you have excessive thirst?',
          'How often do you have to urinate more frequently than normal (outside of nighttime)?',
          'How often do you feel unusually tired after eating?',
          'How difficult is it for you to maintain your weight or lose weight?',
          'How would you rate your energy level in daily life?',
        ],
      },
      G: {
        title: 'G. Digestive System',
        questions: [
          'How often do you suffer from heartburn or acid reflux?',
          'How often do you have abdominal pain or cramps?',
          'How often do you suffer from bloating or feeling of fullness?',
          'How regular are your bowel movements?',
          'How satisfied are you with your digestion overall?',
        ],
      },
      H: {
        title: 'H. Musculoskeletal System (Bones, Joints, Muscles)',
        questions: [
          'How often do you have back pain?',
          'How often do you suffer from joint pain or stiffness?',
          'How often do you have muscle tension or muscle pain?',
          'How would you rate your general mobility?',
          'How much do pain affect your daily activities?',
        ],
      },
      I: {
        title: 'I. Psychological Well-being',
        questions: [
          'How often do you feel down or depressed?',
          'How often do you have difficulty concentrating?',
          'How often do you feel anxious or nervous?',
          'How would you rate the quality of your sleep?',
          'How often do you have difficulty falling asleep or staying asleep?',
          'How would you rate your stress level in daily life?',
        ],
      },
      J: {
        title: 'J. General Vitality and Quality of Life',
        questions: [
          'How would you rate your general state of health?',
          'How satisfied are you with your physical fitness?',
          'How would you rate your overall quality of life?',
          'How often do you feel full of energy and drive?',
          'How satisfied are you with your work-life balance?',
        ],
      },
    },
    
    // Dashboard
    dashboard: 'Dashboard',
    results: 'Results',
    patientView: '👤 Patient View',
    doctorView: '🩺 Doctor View',
    completedOn: 'Completed on',
    points: 'Points',
    noResults: 'No results available',
    noResultsMessage: 'Please complete a questionnaire first.',
    
    // Section Names (short)
    sectionNames: {
      B: 'Urogenital System',
      C: 'Sexual Health',
      D: 'Hormonal Health',
      E: 'Cardiovascular',
      F: 'Metabolism',
      G: 'Digestive',
      H: 'Musculoskeletal',
      I: 'Mental Health',
      J: 'Quality of Life',
    },
    
    // Interpretations
    interpretations: {
      good: 'Good',
      slightlyImpaired: 'Slightly Impaired',
      moderatelyImpaired: 'Moderately Impaired',
      severelyImpaired: 'Severely Impaired',
      noED: 'No Erectile Dysfunction',
      mildED: 'Mild ED',
      mildModerateED: 'Mild to Moderate ED',
      moderateED: 'Moderate ED',
      severeED: 'Severe ED',
    },
    
    // Patient Info
    patientInfoTitle: 'ℹ️ Note for Patients',
    patientInfoText: 'Your results have been successfully recorded. Your doctor will discuss this evaluation with you and provide recommendations to improve your health if necessary.',
    patientInfoNextSteps: 'Next steps:',
    patientInfoAction: 'Schedule an appointment to discuss the results with your doctor.',
    
    // Recommendations
    recommendationsTitle: '💊 Recommended Supplements',
    recommendations: {
      B: '🔹 Prostate Health: Saw Palmetto, Pumpkin Seed Extract, Zinc',
      C: '🔹 Sexual Health: L-Arginine, Maca, Tribulus Terrestris',
      D: '🔹 Hormonal Balance: Vitamin D3, Zinc, Magnesium, Ashwagandha',
      E: '🔹 Cardiovascular: Omega-3, Coenzyme Q10, Magnesium',
      F: '🔹 Metabolism: Chromium, Alpha-Lipoic Acid, Berberine',
      G: '🔹 Digestive: Probiotics, Enzymes, L-Glutamine',
      H: '🔹 Musculoskeletal: Glucosamine, MSM, Collagen',
      I: '🔹 Mental Health: Omega-3, B-Vitamins, Magnesium, Rhodiola',
      J: '🔹 Vitality: Multivitamin, Coenzyme Q10, B-Complex',
    },
  },
}

export type Language = 'de' | 'en'
export type TranslationKey = keyof typeof translations.de

