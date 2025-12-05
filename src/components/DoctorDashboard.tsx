import { useState } from 'react';
import { trpc } from '../lib/trpc';
import TrendChart from './TrendChart';

interface DoctorDashboardProps {
  onBack: () => void;
}

export function DoctorDashboard({ onBack }: DoctorDashboardProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // Fetch all patients
  const { data: patients, isLoading: patientsLoading } = trpc.patients.list.useQuery({
    limit: 100,
  });

  // Fetch surveys for selected patient
  const { data: surveys, isLoading: surveysLoading } = trpc.surveys.getByPatient.useQuery(
    { patientId: selectedPatientId! },
    { enabled: selectedPatientId !== null }
  );

  const selectedPatient = patients?.find(p => p.id === selectedPatientId);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Arzt-Dashboard</h2>
        <button onClick={onBack} style={{
          padding: '0.5rem 1rem',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ← Zurück
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        {/* Patient List */}
        <div>
          <h3 style={{ marginTop: 0 }}>Patienten</h3>
          {patientsLoading ? (
            <div>Lädt...</div>
          ) : patients && patients.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  style={{
                    padding: '1rem',
                    background: selectedPatientId === patient.id ? '#667eea' : 'white',
                    color: selectedPatientId === patient.id ? 'white' : '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {patient.firstName} {patient.lastName}
                  </div>
                  {patient.patientNumber && (
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.25rem' }}>
                      Nr. {patient.patientNumber}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px', textAlign: 'center', color: '#6c757d' }}>
              Keine Patienten vorhanden
            </div>
          )}
        </div>

        {/* Survey History */}
        <div>
          {selectedPatient ? (
            <>
              <h3 style={{ marginTop: 0 }}>
                Fragebogen-Verlauf: {selectedPatient.firstName} {selectedPatient.lastName}
              </h3>
              
              {surveysLoading ? (
                <div>Lädt...</div>
              ) : surveys && surveys.length > 0 ? (
                <>
                  {/* Trend Chart */}
                  {surveys.length >= 2 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <TrendChart surveys={surveys} language="de" />
                    </div>
                  )}

                  {/* Survey History */}
                  <h3 style={{ marginTop: surveys.length >= 2 ? '2rem' : 0, marginBottom: '1rem' }}>Fragebogen-Historie</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {surveys.map(survey => {
                    const date = new Date(survey.completedAt);
                    const sections = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
                    
                    return (
                      <div
                        key={survey.id}
                        style={{
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          padding: '1.5rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ margin: 0 }}>
                            Fragebogen vom {date.toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </h4>
                          <div style={{
                            padding: '0.5rem 1rem',
                            background: '#e7f3ff',
                            borderRadius: '4px',
                            fontWeight: 600,
                            color: '#0066cc'
                          }}>
                            Gesamt: {survey.totalScore} Punkte
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                          {Object.entries(sections).map(([key, data]) => {
                            const percentage = (data.score / data.maxScore) * 100;
                            let color = '#28a745';
                            if (percentage < 40) color = '#dc3545';
                            else if (percentage < 60) color = '#ffc107';
                            else if (percentage < 80) color = '#17a2b8';

                            return (
                              <div
                                key={key}
                                style={{
                                  padding: '1rem',
                                  background: '#f8f9fa',
                                  borderRadius: '4px',
                                  borderLeft: `4px solid ${color}`
                                }}
                              >
                                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                                  Sektion {key}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                  {data.score}/{data.maxScore}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                  {data.interpretation}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Timeline Progress Bar */}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
                          <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                            Zeitpunkt: {date.toLocaleTimeString('de-DE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} Uhr
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                </>
              ) : (
                <div style={{
                  padding: '3rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <p>Noch keine Fragebögen für diesen Patienten vorhanden.</p>
                  <p style={{ fontSize: '0.875rem' }}>
                    Wählen Sie "Patienten verwalten" um einen Fragebogen auszufüllen.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{
              padding: '3rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <p>Wählen Sie einen Patienten aus der Liste, um dessen Fragebogen-Verlauf anzuzeigen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
