import { describe, it, expect, beforeAll } from 'vitest';
import { generateRecommendations } from '../server/utils/recommendationEngine';

describe('Recommendation Engine', () => {
  it('should generate recommendations for low scores', () => {
    const scores = {
      B: { score: 2, maxScore: 10, interpretation: 'Kritisch' },
      C: { score: 5, maxScore: 25, interpretation: 'Schwere ED' },
      D: { score: 3, maxScore: 15, interpretation: 'Kritisch' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBeGreaterThan(0);
    
    // All recommendations should be high priority for critical scores
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
    expect(highPriorityRecs.length).toBeGreaterThan(0);
  });

  it('should generate IIEF-5 specific recommendations for section C', () => {
    const scores = {
      C: { score: 10, maxScore: 25, interpretation: 'Moderate ED' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].section).toBe('C');
    expect(recommendations[0].recommendation).toContain('erektile');
  });

  it('should not generate recommendations for excellent scores', () => {
    const scores = {
      B: { score: 9, maxScore: 10, interpretation: 'Ausgezeichnet' },
      C: { score: 23, maxScore: 25, interpretation: 'Keine ED' },
      D: { score: 14, maxScore: 15, interpretation: 'Ausgezeichnet' },
    };

    const recommendations = generateRecommendations(scores);

    // Should have few or no recommendations for excellent scores
    expect(recommendations.length).toBeLessThanOrEqual(1);
  });

  it('should sort recommendations by priority and percentage', () => {
    const scores = {
      B: { score: 2, maxScore: 10, interpretation: 'Kritisch' }, // 20% - high
      C: { score: 12, maxScore: 25, interpretation: 'Leichte ED' }, // 48% - medium
      D: { score: 8, maxScore: 15, interpretation: 'Moderat' }, // 53% - medium
      E: { score: 4, maxScore: 10, interpretation: 'Kritisch' }, // 40% - high
    };

    const recommendations = generateRecommendations(scores);

    // First recommendations should be high priority
    expect(recommendations[0].priority).toBe('high');
    
    // Within same priority, lower percentages should come first
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
    if (highPriorityRecs.length > 1) {
      expect(highPriorityRecs[0].percentage).toBeLessThanOrEqual(highPriorityRecs[1].percentage);
    }
  });

  it('should generate appropriate recommendations for moderate scores', () => {
    const scores = {
      E: { score: 5, maxScore: 10, interpretation: 'Moderat' }, // 50%
      F: { score: 7, maxScore: 12, interpretation: 'Moderat' }, // 58%
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBe(2);
    
    // Moderate scores should have medium priority
    recommendations.forEach(rec => {
      expect(rec.priority).toBe('medium');
    });
  });

  it('should include section names in recommendations', () => {
    const scores = {
      B: { score: 3, maxScore: 10, interpretation: 'Kritisch' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations[0].sectionName).toBe('Urogenitalsystem');
  });

  it('should calculate percentage correctly', () => {
    const scores = {
      B: { score: 5, maxScore: 10, interpretation: 'Moderat' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations[0].percentage).toBe(50);
    expect(recommendations[0].score).toBe(5);
  });

  it('should handle all health sections', () => {
    const scores = {
      B: { score: 2, maxScore: 10, interpretation: 'Kritisch' },
      C: { score: 8, maxScore: 25, interpretation: 'Schwere ED' },
      D: { score: 3, maxScore: 15, interpretation: 'Kritisch' },
      E: { score: 4, maxScore: 10, interpretation: 'Kritisch' },
      F: { score: 5, maxScore: 12, interpretation: 'Kritisch' },
      G: { score: 3, maxScore: 10, interpretation: 'Kritisch' },
      H: { score: 4, maxScore: 10, interpretation: 'Kritisch' },
      I: { score: 3, maxScore: 10, interpretation: 'Kritisch' },
      J: { score: 2, maxScore: 8, interpretation: 'Kritisch' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations.length).toBe(9);
    
    // Check all sections are present
    const sections = recommendations.map(r => r.section);
    expect(sections).toContain('B');
    expect(sections).toContain('C');
    expect(sections).toContain('D');
    expect(sections).toContain('E');
    expect(sections).toContain('F');
    expect(sections).toContain('G');
    expect(sections).toContain('H');
    expect(sections).toContain('I');
    expect(sections).toContain('J');
  });

  it('should provide detailed recommendations with actionable advice', () => {
    const scores = {
      D: { score: 3, maxScore: 15, interpretation: 'Kritisch' },
    };

    const recommendations = generateRecommendations(scores);

    expect(recommendations[0].recommendation).toContain('Testosteron');
    expect(recommendations[0].recommendation.length).toBeGreaterThan(100);
  });
});
