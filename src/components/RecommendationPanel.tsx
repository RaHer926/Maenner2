import React, { useState } from 'react';
import { trpc } from '../lib/trpc';

interface Recommendation {
  id: number;
  surveyId: number;
  section: string;
  recommendation: string;
  priority: string | null;
  status: string | null;
  modifiedBy?: number | null;
  modifiedAt?: string | null;
  createdAt: string;
}

interface RecommendationPanelProps {
  surveyId: number;
  onClose?: () => void;
  language?: 'de' | 'en';
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  surveyId,
  onClose,
  language = 'de',
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const translations = {
    de: {
      title: 'Behandlungsempfehlungen',
      generate: 'Empfehlungen generieren',
      generating: 'Generiere...',
      noRecommendations: 'Keine Empfehlungen vorhanden',
      priority: 'Priorität',
      status: 'Status',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      approve: 'Genehmigen',
      reject: 'Ablehnen',
      delete: 'Löschen',
      close: 'Schließen',
      priorities: {
        high: 'Hoch',
        medium: 'Mittel',
        low: 'Niedrig',
      },
      statuses: {
        pending: 'Ausstehend',
        approved: 'Genehmigt',
        rejected: 'Abgelehnt',
        modified: 'Geändert',
      },
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
      title: 'Treatment Recommendations',
      generate: 'Generate Recommendations',
      generating: 'Generating...',
      noRecommendations: 'No recommendations available',
      priority: 'Priority',
      status: 'Status',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      approve: 'Approve',
      reject: 'Reject',
      delete: 'Delete',
      close: 'Close',
      priorities: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      statuses: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        modified: 'Modified',
      },
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

  // Queries
  const { data: recommendations, isLoading, refetch } = trpc.recommendations.getBySurvey.useQuery({
    surveyId,
  });

  // Mutations
  const generateMutation = trpc.recommendations.generate.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const updateMutation = trpc.recommendations.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setEditText('');
    },
  });

  const updateStatusMutation = trpc.recommendations.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.recommendations.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ surveyId });
  };

  const handleEdit = (rec: Recommendation) => {
    setEditingId(rec.id);
    setEditText(rec.recommendation);
  };

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, recommendation: editText });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'rejected' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Möchten Sie diese Empfehlung wirklich löschen?')) {
      deleteMutation.mutate({ id });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      case 'modified':
        return '#17a2b8';
      case 'pending':
      default:
        return '#ffc107';
    }
  };

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>{t.title}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: generateMutation.isPending ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: generateMutation.isPending ? 0.6 : 1,
            }}
          >
            {generateMutation.isPending ? t.generating : t.generate}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {t.close}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>Lädt...</div>
      ) : !recommendations || recommendations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '6px', color: '#6c757d' }}>
          {t.noRecommendations}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '1.5rem',
                background: '#fff',
                borderLeft: `4px solid ${getPriorityColor(rec.priority || 'medium')}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    {t.sections[rec.section as keyof typeof t.sections] || rec.section}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: getPriorityColor(rec.priority || 'medium'), fontWeight: 600 }}>
                      {t.priority}: {t.priorities[(rec.priority || 'medium') as keyof typeof t.priorities] || rec.priority}
                    </span>
                    <span style={{ color: getStatusColor(rec.status || 'pending'), fontWeight: 600 }}>
                      {t.status}: {t.statuses[(rec.status || 'pending') as keyof typeof t.statuses] || rec.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingId === rec.id ? (
                    <>
                      <button
                        onClick={() => handleSave(rec.id)}
                        disabled={updateMutation.isPending}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        {t.save}
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        {t.cancel}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(rec)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        {t.edit}
                      </button>
                      {rec.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(rec.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            {t.approve}
                          </button>
                          <button
                            onClick={() => handleReject(rec.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ffc107',
                              color: '#212529',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            {t.reject}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(rec.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        {t.delete}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Recommendation Text */}
              {editingId === rec.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '0.75rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              ) : (
                <p style={{ margin: 0, lineHeight: 1.6, color: '#495057', whiteSpace: 'pre-wrap' }}>
                  {rec.recommendation}
                </p>
              )}

              {/* Modified Info */}
              {rec.modifiedAt && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6', fontSize: '0.875rem', color: '#6c757d' }}>
                  Zuletzt geändert: {new Date(rec.modifiedAt).toLocaleString('de-DE')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
