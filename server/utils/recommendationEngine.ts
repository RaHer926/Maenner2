/**
 * Recommendation Engine for Men's Health Survey
 * Generates personalized health recommendations based on survey scores
 */

interface SectionScore {
  score: number;
  maxScore: number;
  interpretation: string;
}

interface Recommendation {
  section: string;
  sectionName: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  score: number;
  percentage: number;
}

const sectionNames: Record<string, string> = {
  B: 'Urogenitalsystem',
  C: 'Sexuelle Gesundheit',
  D: 'Hormonelle Gesundheit',
  E: 'Herz-Kreislauf-System',
  F: 'Stoffwechsel',
  G: 'Verdauungssystem',
  H: 'Bewegungsapparat',
  I: 'Psychische Gesundheit',
  J: 'Lebensqualität',
};

/**
 * Generate recommendations based on survey scores
 */
export function generateRecommendations(
  scores: Record<string, SectionScore>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  Object.entries(scores).forEach(([sectionKey, sectionData]) => {
    const percentage = (sectionData.score / sectionData.maxScore) * 100;
    const recommendation = getRecommendationForSection(
      sectionKey,
      percentage,
      sectionData.score
    );

    if (recommendation) {
      recommendations.push({
        section: sectionKey,
        sectionName: sectionNames[sectionKey] || sectionKey,
        recommendation: recommendation.text,
        priority: recommendation.priority,
        score: sectionData.score,
        percentage,
      });
    }
  });

  // Sort by priority (high first) and then by percentage (lowest first)
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.percentage - b.percentage;
  });
}

/**
 * Get specific recommendation for a section based on score
 */
function getRecommendationForSection(
  section: string,
  percentage: number,
  score: number
): { text: string; priority: 'high' | 'medium' | 'low' } | null {
  // Section C (Sexual Health) uses IIEF-5 scoring
  if (section === 'C') {
    return getIIEF5Recommendation(score);
  }

  // For other sections, use percentage-based recommendations
  if (percentage < 20) {
    return {
      text: getSectionRecommendation(section, 'critical'),
      priority: 'high',
    };
  } else if (percentage < 40) {
    return {
      text: getSectionRecommendation(section, 'concerning'),
      priority: 'high',
    };
  } else if (percentage < 60) {
    return {
      text: getSectionRecommendation(section, 'moderate'),
      priority: 'medium',
    };
  } else if (percentage < 80) {
    return {
      text: getSectionRecommendation(section, 'good'),
      priority: 'low',
    };
  }

  // No recommendation needed for excellent scores (>= 80%)
  return null;
}

/**
 * IIEF-5 specific recommendations for sexual health
 */
function getIIEF5Recommendation(
  score: number
): { text: string; priority: 'high' | 'medium' | 'low' } {
  if (score < 8) {
    return {
      text: 'Schwere erektile Dysfunktion festgestellt. Dringend empfohlen: Urologische Untersuchung, Hormondiagnostik (Testosteron, LH, Prolaktin), Gefäßuntersuchung. Mögliche Therapieoptionen: PDE-5-Hemmer, SKAT-Therapie, Vakuumpumpe. Lebensstilmodifikation: Gewichtsreduktion, regelmäßige Bewegung, Stressreduktion.',
      priority: 'high',
    };
  } else if (score < 12) {
    return {
      text: 'Moderate erektile Dysfunktion. Empfohlen: Urologische Konsultation, Hormondiagnostik, Herz-Kreislauf-Check. Therapieansätze: PDE-5-Hemmer (Sildenafil, Tadalafil), Beckenbodentraining. Lifestyle: Ausdauersport 3x/Woche, mediterrane Ernährung, Alkoholreduktion.',
      priority: 'high',
    };
  } else if (score < 17) {
    return {
      text: 'Leicht bis moderate erektile Dysfunktion. Empfohlen: Ärztliche Abklärung, Testosteronbestimmung. Maßnahmen: Beckenbodentraining, regelmäßige körperliche Aktivität, Stressmanagement, ausreichend Schlaf. Bei Bedarf: niedrig dosierte PDE-5-Hemmer.',
      priority: 'medium',
    };
  } else if (score < 22) {
    return {
      text: 'Leichte erektile Dysfunktion. Empfohlen: Lifestyle-Optimierung durch regelmäßigen Sport, gesunde Ernährung, Stressreduktion. Beckenbodenübungen können hilfreich sein. Bei Verschlechterung: ärztliche Konsultation.',
      priority: 'low',
    };
  }

  return {
    text: 'Keine erektile Dysfunktion. Zur Prävention: Gesunder Lebensstil beibehalten, regelmäßige Bewegung, ausgewogene Ernährung.',
    priority: 'low',
  };
}

/**
 * Get section-specific recommendations based on severity
 */
function getSectionRecommendation(
  section: string,
  severity: 'critical' | 'concerning' | 'moderate' | 'good'
): string {
  const recommendations: Record<string, Record<string, string>> = {
    B: {
      critical:
        'Urogenitale Beschwerden: Dringend urologische Untersuchung empfohlen. Abklärung: PSA-Wert, Ultraschall, Urinanalyse. Mögliche Ursachen: Prostatitis, BPH, Harnwegsinfekt. Therapie je nach Diagnose.',
      concerning:
        'Urogenitale Symptome vorhanden: Urologische Konsultation ratsam. Untersuchungen: PSA, Uroflowmetrie, Restharnbestimmung. Präventiv: Ausreichend trinken (2L/Tag), Beckenbodentraining, regelmäßige Entleerung.',
      moderate:
        'Leichte urogenitale Beschwerden: Beobachten und bei Verschlechterung ärztliche Abklärung. Maßnahmen: Ausreichend Flüssigkeitszufuhr, Vermeidung von Koffein/Alkohol am Abend, Beckenbodenübungen.',
      good: 'Urogenitale Gesundheit gut. Zur Prävention: Ausreichend trinken, regelmäßige Blasenentleerung, jährliche Vorsorge ab 45 Jahren.',
    },
    D: {
      critical:
        'Hormonelle Dysbalance wahrscheinlich: Dringend endokrinologische/urologische Abklärung. Labor: Testosteron (morgens), LH, FSH, Prolaktin, SHBG, Vitamin D. Therapieoptionen: Testosteronsubstitution, Lifestyle-Modifikation, Gewichtsreduktion.',
      concerning:
        'Hormonelle Symptome: Ärztliche Untersuchung empfohlen. Labordiagnostik: Gesamttestosteron, freies Testosteron, SHBG. Maßnahmen: Krafttraining 3x/Woche, proteinreiche Ernährung, ausreichend Schlaf (7-8h), Stressreduktion.',
      moderate:
        'Leichte hormonelle Auffälligkeiten: Lifestyle-Optimierung empfohlen. Krafttraining, Zink-/Vitamin-D-Supplementierung, Gewichtsmanagement, Schlafhygiene. Bei Persistenz: Hormondiagnostik.',
      good: 'Hormonelle Balance gut. Zur Erhaltung: Regelmäßiges Krafttraining, ausgewogene Ernährung, ausreichend Schlaf, Stressmanagement.',
    },
    E: {
      critical:
        'Kardiovaskuläre Risikofaktoren: Dringend kardiologische Untersuchung. Diagnostik: Blutdruck, Langzeit-EKG, Belastungs-EKG, Lipidstatus, Blutzucker. Sofortmaßnahmen: Rauchstopp, Gewichtsreduktion, salzarme Ernährung.',
      concerning:
        'Herz-Kreislauf-Beschwerden: Ärztliche Abklärung empfohlen. Check: Blutdruck, Cholesterin, Blutzucker, EKG. Maßnahmen: Ausdauersport 150min/Woche, mediterrane Diät, Salzreduktion, Gewichtsnormalisierung.',
      moderate:
        'Leichte kardiovaskuläre Symptome: Lifestyle-Modifikation. Regelmäßige Bewegung, herzgesunde Ernährung (Omega-3, Vollkorn), Stressabbau, Blutdruckkontrolle. Bei Verschlechterung: ärztliche Konsultation.',
      good: 'Herz-Kreislauf-System gut. Prävention: Regelmäßiger Ausdauersport, gesunde Ernährung, Nichtrauchen, Stressmanagement, jährlicher Check-up.',
    },
    F: {
      critical:
        'Metabolische Störung wahrscheinlich: Dringend internistische Abklärung. Labor: Nüchternblutzucker, HbA1c, Lipidprofil, Leberwerte, TSH. Maßnahmen: Gewichtsreduktion, Low-Carb-Ernährung, Bewegung, ggf. Metformin.',
      concerning:
        'Stoffwechselprobleme: Ärztliche Untersuchung ratsam. Diagnostik: Blutzucker, Insulin, Lipide, Leberwerte. Therapie: Ernährungsumstellung, Intervallfasten, regelmäßige Bewegung, Gewichtsreduktion 5-10%.',
      moderate:
        'Leichte Stoffwechselauffälligkeiten: Lifestyle-Änderung empfohlen. Ausgewogene Ernährung, Zuckerreduktion, regelmäßige Mahlzeiten, Bewegung 30min/Tag, ausreichend Schlaf.',
      good: 'Stoffwechsel gut. Zur Erhaltung: Ausgewogene Ernährung, regelmäßige Bewegung, Normalgewicht halten, ausreichend Schlaf.',
    },
    G: {
      critical:
        'Gastrointestinale Beschwerden: Gastroenterologische Abklärung empfohlen. Diagnostik: Stuhluntersuchung, Blutbild, ggf. Endoskopie. Maßnahmen: Ernährungsprotokoll, Ausschluss Intoleranzen, Probiotika.',
      concerning:
        'Verdauungsprobleme: Ärztliche Konsultation ratsam. Maßnahmen: Ballaststoffreiche Ernährung, ausreichend Flüssigkeit, Probiotika, Stressreduktion, regelmäßige Mahlzeiten.',
      moderate:
        'Leichte Verdauungsbeschwerden: Ernährungsoptimierung. Mehr Ballaststoffe, fermentierte Lebensmittel, ausreichend Wasser, regelmäßige Bewegung, Stressmanagement.',
      good: 'Verdauung gut. Zur Erhaltung: Ballaststoffreiche Ernährung, ausreichend Flüssigkeit, regelmäßige Bewegung, Stressabbau.',
    },
    H: {
      critical:
        'Muskuloskelettale Beschwerden: Orthopädische/rheumatologische Abklärung. Diagnostik: Röntgen, MRT, Entzündungsparameter. Therapie: Physiotherapie, Schmerzmanagement, ggf. Infiltrationen, Bewegungstherapie.',
      concerning:
        'Bewegungsapparat-Probleme: Ärztliche Untersuchung empfohlen. Maßnahmen: Physiotherapie, Krafttraining, Dehnübungen, Ergonomie-Optimierung, Gewichtsreduktion bei Übergewicht.',
      moderate:
        'Leichte muskuloskelettale Beschwerden: Bewegungstherapie. Regelmäßiges Krafttraining, Dehnübungen, Rückengymnastik, ergonomischer Arbeitsplatz, Vitamin-D-Supplementierung.',
      good: 'Bewegungsapparat gut. Prävention: Regelmäßiges Kraft- und Beweglichkeitstraining, gute Haltung, ausreichend Vitamin D und Calcium.',
    },
    I: {
      critical:
        'Psychische Belastung: Dringend psychiatrische/psychotherapeutische Hilfe empfohlen. Diagnostik: Depression-Screening, Burnout-Test. Therapie: Psychotherapie, ggf. Medikation, Stressmanagement, soziale Unterstützung.',
      concerning:
        'Psychische Symptome: Ärztliche/psychologische Konsultation ratsam. Maßnahmen: Stressreduktion, Entspannungstechniken, ausreichend Schlaf, soziale Kontakte, ggf. Kurzzeittherapie.',
      moderate:
        'Leichte psychische Belastung: Selbstfürsorge wichtig. Stressmanagement, Achtsamkeitsübungen, regelmäßige Bewegung, ausreichend Schlaf, soziale Aktivitäten, Work-Life-Balance.',
      good: 'Psychische Gesundheit gut. Zur Erhaltung: Stressmanagement, ausreichend Schlaf, soziale Kontakte, regelmäßige Bewegung, Hobbys.',
    },
    J: {
      critical:
        'Lebensqualität stark eingeschränkt: Ganzheitliche ärztliche Betreuung empfohlen. Abklärung aller Gesundheitsbereiche, psychosoziale Unterstützung, Lifestyle-Coaching, ggf. Rehabilitation.',
      concerning:
        'Lebensqualität beeinträchtigt: Ärztliche Beratung sinnvoll. Ganzheitlicher Ansatz: Medizinische Abklärung, Lifestyle-Optimierung, Stressmanagement, soziale Unterstützung, Hobbys.',
      moderate:
        'Lebensqualität verbesserungswürdig: Ganzheitliche Optimierung. Work-Life-Balance, regelmäßige Bewegung, gesunde Ernährung, ausreichend Schlaf, soziale Kontakte, Hobbys.',
      good: 'Lebensqualität gut. Zur Erhaltung: Ausgewogener Lebensstil, regelmäßige Bewegung, soziale Kontakte, Hobbys, Stressmanagement.',
    },
  };

  return (
    recommendations[section]?.[severity] ||
    'Bitte konsultieren Sie Ihren Arzt für weitere Empfehlungen.'
  );
}
