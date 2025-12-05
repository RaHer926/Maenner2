import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Survey {
  id: number;
  completedAt: string;
  scores?: Record<string, { score: number; maxScore: number; interpretation: string }> | unknown;
  totalScore?: number | null;
}

interface TrendChartProps {
  surveys: Survey[];
  language?: 'de' | 'en';
}

const TrendChart: React.FC<TrendChartProps> = ({ surveys, language = 'de' }) => {
  const translations = {
    de: {
      title: 'Gesundheitsverlauf',
      totalScore: 'Gesamtpunktzahl',
      sections: {
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
    },
    en: {
      title: 'Health Progression',
      totalScore: 'Total Score',
      sections: {
        B: 'Urogenital System',
        C: 'Sexual Health',
        D: 'Hormonal Health',
        E: 'Cardiovascular',
        F: 'Metabolism',
        G: 'Digestive System',
        H: 'Musculoskeletal',
        I: 'Mental Health',
        J: 'Quality of Life',
      },
    },
  };

  const t = translations[language];

  if (!surveys || surveys.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
        Keine Daten für Trendanalyse verfügbar. Mindestens 2 Fragebögen erforderlich.
      </div>
    );
  }

  // Sort surveys by date
  const sortedSurveys = [...surveys].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  // Prepare labels (dates)
  const labels = sortedSurveys.map((survey) =>
    new Date(survey.completedAt).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );

  // Color palette for different sections
  const colors = {
    B: 'rgb(255, 99, 132)',
    C: 'rgb(255, 159, 64)',
    D: 'rgb(255, 205, 86)',
    E: 'rgb(75, 192, 192)',
    F: 'rgb(54, 162, 235)',
    G: 'rgb(153, 102, 255)',
    H: 'rgb(201, 203, 207)',
    I: 'rgb(255, 99, 255)',
    J: 'rgb(99, 255, 132)',
  };

  // Prepare datasets for each section
  const sectionKeys = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const datasets = sectionKeys.map((sectionKey) => {
    const data = sortedSurveys.map((survey) => {
      if (!survey.scores) return 0;
      const scores = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
      const sectionScore = scores[sectionKey];
      if (!sectionScore) return 0;
      // Convert to percentage
      return ((sectionScore.score / sectionScore.maxScore) * 100).toFixed(1);
    });

    return {
      label: t.sections[sectionKey as keyof typeof t.sections],
      data,
      borderColor: colors[sectionKey as keyof typeof colors],
      backgroundColor: colors[sectionKey as keyof typeof colors] + '20',
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: t.title,
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)',
        },
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Datum',
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ height: '400px' }}>
        <Line options={options} data={chartData} />
      </div>

      {/* Summary Statistics */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#495057' }}>Zusammenfassung</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {sectionKeys.map((sectionKey) => {
            const latestSurvey = sortedSurveys[sortedSurveys.length - 1];
            const firstSurvey = sortedSurveys[0];
            
            if (!latestSurvey.scores || !firstSurvey.scores) return null;
            
            const latestScores = latestSurvey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
            const firstScores = firstSurvey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
            
            const latestScore = latestScores[sectionKey];
            const firstScore = firstScores[sectionKey];
            
            if (!latestScore || !firstScore) return null;
            
            const latestPercentage = (latestScore.score / latestScore.maxScore) * 100;
            const firstPercentage = (firstScore.score / firstScore.maxScore) * 100;
            const change = latestPercentage - firstPercentage;
            
            return (
              <div key={sectionKey} style={{ padding: '0.75rem', background: 'white', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                  {t.sections[sectionKey as keyof typeof t.sections]}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#212529' }}>
                  {latestPercentage.toFixed(0)}%
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: change >= 0 ? '#28a745' : '#dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span>{change >= 0 ? '↑' : '↓'}</span>
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
