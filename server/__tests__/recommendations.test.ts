import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../database/db.js';
import { users, patients, surveys, surveyRecommendations } from '../../database/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

describe('Recommendation System', () => {
  let testUserId: number;
  let testPatientId: number;
  let testSurveyId: number;

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    const [user] = await db
      .insert(users)
      .values({
        email: `test-rec-${Date.now()}@example.com`,
        password: hashedPassword,
        name: 'Test Recommendation User',
        role: 'doctor',
      })
      .returning();
    testUserId = user.id;

    // Create test patient
    const [patient] = await db
      .insert(patients)
      .values({
        firstName: 'Test',
        lastName: 'Recommendation Patient',
        email: 'test-rec@example.com',
        createdBy: testUserId,
      })
      .returning();
    testPatientId = patient.id;

    // Create test survey with realistic scores
    const testScores = {
      B: { score: 35, maxScore: 35, interpretation: 'Sehr gut' },
      C: { score: 6, maxScore: 30, interpretation: 'Schwere erektile Dysfunktion' },
      D: { score: 60, maxScore: 60, interpretation: 'Sehr gut' },
      E: { score: 30, maxScore: 30, interpretation: 'Sehr gut' },
      F: { score: 30, maxScore: 30, interpretation: 'Sehr gut' },
      G: { score: 25, maxScore: 25, interpretation: 'Sehr gut' },
      H: { score: 25, maxScore: 25, interpretation: 'Sehr gut' },
      I: { score: 30, maxScore: 30, interpretation: 'Sehr gut' },
      J: { score: 25, maxScore: 25, interpretation: 'Sehr gut' },
    };

    const [survey] = await db
      .insert(surveys)
      .values({
        patientId: testPatientId,
        language: 'de',
        answers: {},
        scores: testScores,
        totalScore: 266,
        createdBy: testUserId,
      })
      .returning();
    testSurveyId = survey.id;
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (testSurveyId) {
      await db.delete(surveyRecommendations).where(eq(surveyRecommendations.surveyId, testSurveyId));
      await db.delete(surveys).where(eq(surveys.id, testSurveyId));
    }
    if (testPatientId) {
      await db.delete(patients).where(eq(patients.id, testPatientId));
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  it('should generate recommendations for a survey', async () => {
    // Import recommendation engine
    const { generateRecommendations } = await import('../utils/recommendationEngine.js');

    // Get survey
    const [survey] = await db
      .select()
      .from(surveys)
      .where(eq(surveys.id, testSurveyId))
      .limit(1);

    expect(survey).toBeDefined();

    // Generate recommendations
    const scores = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
    const recommendations = generateRecommendations(scores);

    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);

    // Check recommendation structure
    recommendations.forEach((rec) => {
      expect(rec).toHaveProperty('section');
      expect(rec).toHaveProperty('recommendation');
      expect(rec).toHaveProperty('priority');
      expect(['high', 'medium', 'low']).toContain(rec.priority);
    });

    // Save recommendations to database
    for (const rec of recommendations) {
      await db.insert(surveyRecommendations).values({
        surveyId: testSurveyId,
        section: rec.section,
        recommendation: rec.recommendation,
        priority: rec.priority,
        status: 'pending',
      });
    }

    // Verify recommendations were saved
    const savedRecommendations = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId));

    expect(savedRecommendations.length).toBe(recommendations.length);
  });

  it('should retrieve recommendations for a survey', async () => {
    const recommendations = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId));

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBeGreaterThan(0);

    // Check that recommendations have correct structure
    recommendations.forEach((rec) => {
      expect(rec.id).toBeDefined();
      expect(rec.surveyId).toBe(testSurveyId);
      expect(rec.section).toBeDefined();
      expect(rec.recommendation).toBeDefined();
      expect(rec.priority).toBeDefined();
      expect(rec.status).toBe('pending');
    });
  });

  it('should update recommendation text', async () => {
    const [recommendation] = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId))
      .limit(1);

    expect(recommendation).toBeDefined();

    const newText = 'Updated recommendation text for testing';

    // Update recommendation
    await db
      .update(surveyRecommendations)
      .set({
        recommendation: newText,
        status: 'modified',
        modifiedBy: testUserId,
        modifiedAt: new Date(),
      })
      .where(eq(surveyRecommendations.id, recommendation.id));

    // Verify update
    const [updated] = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.id, recommendation.id))
      .limit(1);

    expect(updated.recommendation).toBe(newText);
    expect(updated.status).toBe('modified');
    expect(updated.modifiedBy).toBe(testUserId);
    expect(updated.modifiedAt).toBeDefined();
  });

  it('should update recommendation status', async () => {
    const [recommendation] = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId))
      .where(eq(surveyRecommendations.status, 'pending'))
      .limit(1);

    if (recommendation) {
      // Update status to approved
      await db
        .update(surveyRecommendations)
        .set({
          status: 'approved',
          modifiedBy: testUserId,
          modifiedAt: new Date(),
        })
        .where(eq(surveyRecommendations.id, recommendation.id));

      // Verify update
      const [updated] = await db
        .select()
        .from(surveyRecommendations)
        .where(eq(surveyRecommendations.id, recommendation.id))
        .limit(1);

      expect(updated.status).toBe('approved');
    }
  });

  it('should delete a recommendation', async () => {
    const [recommendation] = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId))
      .limit(1);

    expect(recommendation).toBeDefined();

    const recId = recommendation.id;

    // Delete recommendation
    await db
      .delete(surveyRecommendations)
      .where(eq(surveyRecommendations.id, recId));

    // Verify deletion
    const [deleted] = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.id, recId))
      .limit(1);

    expect(deleted).toBeUndefined();
  });

  it('should handle regeneration (delete old and insert new)', async () => {
    // Delete all existing recommendations
    await db
      .delete(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId));

    // Verify deletion
    let recommendations = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId));

    expect(recommendations.length).toBe(0);

    // Generate new recommendations
    const { generateRecommendations } = await import('../utils/recommendationEngine.js');
    const [survey] = await db
      .select()
      .from(surveys)
      .where(eq(surveys.id, testSurveyId))
      .limit(1);

    const scores = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
    const newRecommendations = generateRecommendations(scores);

    // Insert new recommendations
    for (const rec of newRecommendations) {
      await db.insert(surveyRecommendations).values({
        surveyId: testSurveyId,
        section: rec.section,
        recommendation: rec.recommendation,
        priority: rec.priority,
        status: 'pending',
      });
    }

    // Verify new recommendations
    recommendations = await db
      .select()
      .from(surveyRecommendations)
      .where(eq(surveyRecommendations.surveyId, testSurveyId));

    expect(recommendations.length).toBe(newRecommendations.length);
    expect(recommendations.every((r) => r.status === 'pending')).toBe(true);
  });
});
