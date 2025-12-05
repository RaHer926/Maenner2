import { describe, it, expect } from 'vitest';

describe('Complete Workflow Integration Test', () => {
  const API_URL = 'http://localhost:3001/trpc';
  let authToken = '';
  let patientId = 0;

  it('should register a new user', async () => {
    const response = await fetch(`${API_URL}/auth.register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `doctor${Date.now()}@test.com`,
        password: 'test123456',
        name: 'Dr. Test',
        role: 'doctor',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.result.data).toHaveProperty('token');
    
    authToken = data.result.data.token;
    console.log('✅ User registered successfully');
  }, 30000);

  it('should create a new patient', async () => {
    const response = await fetch(`${API_URL}/patients.create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        firstName: 'Max',
        lastName: 'Mustermann',
        dateOfBirth: '1980-01-01',
        email: 'max@example.com',
        patientNumber: 'P001',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.result.data).toHaveProperty('id');
    
    patientId = data.result.data.id;
    console.log('✅ Patient created successfully, ID:', patientId);
  }, 30000);

  it('should create a survey for the patient', async () => {
    const answers: Record<string, number> = {};
    
    // Generate sample answers for all sections
    const sections = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const questionCounts = [7, 6, 12, 6, 6, 5, 5, 6, 5];
    
    sections.forEach((section, sectionIdx) => {
      for (let i = 0; i < questionCounts[sectionIdx]; i++) {
        answers[`${section}${i}`] = Math.floor(Math.random() * 5) + 1;
      }
    });

    const scores = {
      B: { score: 25, maxScore: 35, interpretation: 'Gut' },
      C: { score: 20, maxScore: 30, interpretation: 'Leichte ED' },
      D: { score: 40, maxScore: 60, interpretation: 'Mäßig' },
      E: { score: 22, maxScore: 30, interpretation: 'Gut' },
      F: { score: 20, maxScore: 30, interpretation: 'Gut' },
      G: { score: 18, maxScore: 25, interpretation: 'Sehr gut' },
      H: { score: 17, maxScore: 25, interpretation: 'Gut' },
      I: { score: 21, maxScore: 30, interpretation: 'Gut' },
      J: { score: 19, maxScore: 25, interpretation: 'Sehr gut' },
    };

    const response = await fetch(`${API_URL}/surveys.create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        patientId,
        language: 'de',
        answers,
        scores,
        totalScore: 202,
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.result.data).toHaveProperty('id');
    
    console.log('✅ Survey created successfully');
  }, 30000);

  it('should retrieve patient surveys', async () => {
    const response = await fetch(`${API_URL}/surveys.getByPatient?input=${encodeURIComponent(JSON.stringify({ patientId }))}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.result.data).toBeInstanceOf(Array);
    expect(data.result.data.length).toBeGreaterThan(0);
    
    console.log('✅ Retrieved', data.result.data.length, 'survey(s) for patient');
  }, 30000);

  it('should list all patients', async () => {
    const response = await fetch(`${API_URL}/patients.list?input=${encodeURIComponent(JSON.stringify({ limit: 10 }))}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.result.data).toBeInstanceOf(Array);
    expect(data.result.data.length).toBeGreaterThan(0);
    
    console.log('✅ Retrieved', data.result.data.length, 'patient(s)');
  }, 30000);
});
