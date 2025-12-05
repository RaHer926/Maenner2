import { useState } from 'react';
import { trpc } from '../lib/trpc';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  patientNumber?: string;
}

interface PatientManagementProps {
  onSelectPatient: (patient: Patient) => void;
  onBack: () => void;
}

export function PatientManagement({ onSelectPatient, onBack }: PatientManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    patientNumber: '',
  });

  const utils = trpc.useUtils();

  // Fetch patients
  const { data: patients, isLoading } = trpc.patients.list.useQuery({
    search: searchTerm || undefined,
    limit: 50,
  });

  // Create patient mutation
  const createPatient = trpc.patients.create.useMutation({
    onSuccess: () => {
      utils.patients.list.invalidate();
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        patientNumber: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatient.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      patientNumber: formData.patientNumber || undefined,
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Patienten-Verwaltung</h2>
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

      {/* Search and Add Button */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Patient suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {showForm ? 'Abbrechen' : '+ Neuer Patient'}
        </button>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginTop: 0 }}>Neuen Patienten anlegen</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Vorname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Nachname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Geburtsdatum
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Patientennummer
                </label>
                <input
                  type="text"
                  value={formData.patientNumber}
                  onChange={(e) => setFormData({ ...formData, patientNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  E-Mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createPatient.isPending}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                opacity: createPatient.isPending ? 0.7 : 1
              }}
            >
              {createPatient.isPending ? 'Wird gespeichert...' : 'Patient anlegen'}
            </button>
          </form>
        </div>
      )}

      {/* Patient List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Lädt...</div>
      ) : patients && patients.length > 0 ? (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Patientennr.</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Geburtsdatum</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Kontakt</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{patient.patientNumber || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td style={{ padding: '1rem' }}>{patient.dateOfBirth || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {patient.email && <div>{patient.email}</div>}
                    {patient.phone && <div>{patient.phone}</div>}
                    {!patient.email && !patient.phone && '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => onSelectPatient({
                        ...patient,
                        dateOfBirth: patient.dateOfBirth || undefined,
                        email: patient.email || undefined,
                        phone: patient.phone || undefined,
                        patientNumber: patient.patientNumber || undefined,
                      })}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Fragebogen ausfüllen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          background: '#f8f9fa',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <p>Keine Patienten gefunden.</p>
          <p style={{ fontSize: '0.875rem' }}>Legen Sie einen neuen Patienten an, um zu beginnen.</p>
        </div>
      )}
    </div>
  );
}
