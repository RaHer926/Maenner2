import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { users, patients, surveys } from '../database/schema.js';
import { eq } from 'drizzle-orm';

const connectionString = process.env.RAILWAY_DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

describe('Survey Submission and Results', () => {
  let testUserId: number;
  let testPatientId: number;

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const [user] = await db
      .insert(users)
      .values({
        email: 'test-survey@example.com',
        password: hashedPassword,
        name: 'Test Survey User',
      })
      .onConflictDoNothing()
      .returning();

    if (user) {
      testUserId = user.id;
    } else {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, 'test-survey@example.com'))
        .limit(1);
      testUserId = existingUser[0].id;
    }

    // Create test patient
    const [patient] = await db
      .insert(patients)
      .values({
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1985-03-20',
        email: 'testpatient@example.com',
        patientNumber: `P-TEST-${Date.now()}`,
        createdBy: testUserId,
      })
      .returning();

    testPatientId = patient.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testPatientId) {
      await db.delete(surveys).where(eq(surveys.patientId, testPatientId));
      await db.delete(patients).where(eq(patients.id, testPatientId));
    }
    await client.end();
  });

  it('should save survey with answers and scores to database', async () => {
    // Sample survey answers (58 questions across 9 sections)
    const answers: Record<string, number> = {
      // Section B: Urogenitalsystem (7 questions)
      B1: 5,
      B2: 4,
      B3: 5,
      B4: 5,
      B5: 4,
      B6: 5,
      B7: 5,
      // Section C: Sexuelle Gesundheit (6 questions - IIEF-5)
      C1: 4,
      C2: 4,
      C3: 3,
      C4: 4,
      C5: 4,
      C6: 3,
      // Section D: Hormonelle Gesundheit (12 questions)
      D1: 5,
      D2: 5,
      D3: 4,
      D4: 5,
      D5: 5,
      D6: 4,
      D7: 5,
      D8: 5,
      D9: 4,
      D10: 5,
      D11: 5,
      D12: 4,
      // Section E: Herz-Kreislauf (6 questions)
      E1: 5,
      E2: 4,
      E3: 5,
      E4: 5,
      E5: 4,
      E6: 5,
      // Section F: Stoffwechsel (6 questions)
      F1: 5,
      F2: 4,
      F3: 5,
      F4: 5,
      F5: 4,
      F6: 5,
      // Section G: Verdauung (5 questions)
      G1: 5,
      G2: 4,
      G3: 5,
      G4: 5,
      G5: 4,
      // Section H: Bewegungsapparat (5 questions)
      H1: 5,
      H2: 4,
      H3: 5,
      H4: 5,
      H5: 4,
      // Section I: Psyche (6 questions)
      I1: 5,
      I2: 4,
      I3: 5,
      I4: 5,
      I5: 4,
      I6: 5,
      // Section J: Lebensqualität (5 questions)
      J1: 5,
      J2: 4,
      J3: 5,
      J4: 5,
      J5: 4,
    };

    // Calculate scores (matching AppWithAuth logic)
    const sections = {
      B: { name: 'Urogenitalsystem', questions: 7, inverse: true },
      C: { name: 'Sexuelle Gesundheit', questions: 6, inverse: false },
      D: { name: 'Hormonelle Gesundheit', questions: 12, inverse: true },
      E: { name: 'Herz-Kreislauf', questions: 6, inverse: true },
      F: { name: 'Stoffwechsel', questions: 6, inverse: true },
      G: { name: 'Verdauung', questions: 5, inverse: true },
      H: { name: 'Bewegungsapparat', questions: 5, inverse: true },
      I: { name: 'Psyche', questions: 6, inverse: true },
      J: { name: 'Lebensqualität', questions: 5, inverse: true },
    };

    const scores: Record<string, { score: number; maxScore: number; interpretation: string }> = {};

    Object.entries(sections).forEach(([sectionKey, sectionInfo]) => {
      let sectionScore = 0;
      let questionCount = 0;

      Object.entries(answers).forEach(([questionId, value]) => {
        if (questionId.startsWith(sectionKey)) {
          questionCount++;
          if (sectionInfo.inverse) {
            sectionScore += 6 - value;
          } else {
            sectionScore += value;
          }
        }
      });

      const maxScore = sectionInfo.questions * 5;
      const percentage = (sectionScore / maxScore) * 100;

      let interpretation = '';
      if (sectionKey === 'C') {
        // IIEF-5 standard scoring
        if (sectionScore >= 22) interpretation = 'Keine erektile Dysfunktion';
        else if (sectionScore >= 17) interpretation = 'Leichte erektile Dysfunktion';
        else if (sectionScore >= 12) interpretation = 'Leicht bis moderate erektile Dysfunktion';
        else if (sectionScore >= 8) interpretation = 'Moderate erektile Dysfunktion';
        else interpretation = 'Schwere erektile Dysfunktion';
      } else {
        // Inverse scoring interpretation
        if (percentage >= 80) interpretation = 'Sehr gut';
        else if (percentage >= 60) interpretation = 'Gut';
        else if (percentage >= 40) interpretation = 'Mäßig';
        else if (percentage >= 20) interpretation = 'Bedenklich';
        else interpretation = 'Kritisch';
      }

      scores[sectionKey] = {
        score: sectionScore,
        maxScore,
        interpretation,
      };
    });

    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);

    // Insert survey into database
    const [survey] = await db
      .insert(surveys)
      .values({
        patientId: testPatientId,
        language: 'de',
        answers,
        scores,
        totalScore,
        createdBy: testUserId,
      })
      .returning();

    // Assertions
    expect(survey).toBeDefined();
    expect(survey.id).toBeGreaterThan(0);
    expect(survey.patientId).toBe(testPatientId);
    expect(survey.language).toBe('de');
    expect(survey.totalScore).toBe(totalScore);
    expect(Object.keys(survey.answers as Record<string, number>)).toHaveLength(58);
    expect(Object.keys(survey.scores as Record<string, any>)).toHaveLength(9);

    // Verify scores structure
    const savedScores = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
    expect(savedScores.B).toBeDefined();
    expect(savedScores.B.score).toBeGreaterThan(0);
    expect(savedScores.B.maxScore).toBe(35); // 7 questions * 5
    expect(savedScores.B.interpretation).toBeTruthy();

    // Verify IIEF-5 scoring (Section C)
    expect(savedScores.C).toBeDefined();
    expect(savedScores.C.score).toBe(22); // 4+4+3+4+4+3
    expect(savedScores.C.maxScore).toBe(30); // 6 questions * 5
    expect(savedScores.C.interpretation).toBe('Keine erektile Dysfunktion');

    console.log('✅ Survey saved successfully!');
    console.log(`   Survey ID: ${survey.id}`);
    console.log(`   Total Score: ${survey.totalScore}`);
    console.log(`   Sections: ${Object.keys(savedScores).length}`);
  });

  it('should retrieve saved survey from database', async () => {
    // Create a survey first
    const answers = {
      B1: 5,
      B2: 5,
      B3: 5,
      B4: 5,
      B5: 5,
      B6: 5,
      B7: 5,
      C1: 5,
      C2: 5,
      C3: 5,
      C4: 5,
      C5: 5,
      C6: 5,
      D1: 5,
      D2: 5,
      D3: 5,
      D4: 5,
      D5: 5,
      D6: 5,
      D7: 5,
      D8: 5,
      D9: 5,
      D10: 5,
      D11: 5,
      D12: 5,
      E1: 5,
      E2: 5,
      E3: 5,
      E4: 5,
      E5: 5,
      E6: 5,
      F1: 5,
      F2: 5,
      F3: 5,
      F4: 5,
      F5: 5,
      F6: 5,
      G1: 5,
      G2: 5,
      G3: 5,
      G4: 5,
      G5: 5,
      H1: 5,
      H2: 5,
      H3: 5,
      H4: 5,
      H5: 5,
      I1: 5,
      I2: 5,
      I3: 5,
      I4: 5,
      I5: 5,
      I6: 5,
      J1: 5,
      J2: 5,
      J3: 5,
      J4: 5,
      J5: 5,
    };

    const scores = {
      B: { score: 7, maxScore: 35, interpretation: 'Kritisch' },
      C: { score: 30, maxScore: 30, interpretation: 'Keine erektile Dysfunktion' },
      D: { score: 12, maxScore: 60, interpretation: 'Kritisch' },
      E: { score: 6, maxScore: 30, interpretation: 'Kritisch' },
      F: { score: 6, maxScore: 30, interpretation: 'Kritisch' },
      G: { score: 5, maxScore: 25, interpretation: 'Kritisch' },
      H: { score: 5, maxScore: 25, interpretation: 'Kritisch' },
      I: { score: 6, maxScore: 30, interpretation: 'Kritisch' },
      J: { score: 5, maxScore: 25, interpretation: 'Kritisch' },
    };

    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);

    const [createdSurvey] = await db
      .insert(surveys)
      .values({
        patientId: testPatientId,
        language: 'de',
        answers,
        scores,
        totalScore,
        createdBy: testUserId,
      })
      .returning();

    // Retrieve survey
    const retrievedSurveys = await db
      .select()
      .from(surveys)
      .where(eq(surveys.id, createdSurvey.id))
      .limit(1);

    expect(retrievedSurveys).toHaveLength(1);
    const retrievedSurvey = retrievedSurveys[0];
    expect(retrievedSurvey.id).toBe(createdSurvey.id);
    expect(retrievedSurvey.patientId).toBe(testPatientId);
    expect(retrievedSurvey.totalScore).toBe(totalScore);
    expect(Object.keys(retrievedSurvey.answers as Record<string, number>)).toHaveLength(58);

    console.log('✅ Survey retrieved successfully!');
    console.log(`   Retrieved Survey ID: ${retrievedSurvey.id}`);
  });
});
