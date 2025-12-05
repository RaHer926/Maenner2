import { z } from 'zod';
import { router, protectedProcedure } from '../trpc.js';
import { db } from '../../database/db.js';
import { surveyRecommendations, surveys } from '../../database/schema.js';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { generateRecommendations } from '../utils/recommendationEngine.js';

export const recommendationsRouter = router({
  // Generate recommendations for a survey
  generate: protectedProcedure
    .input(z.object({ surveyId: z.number() }))
    .mutation(async ({ input }) => {
      // Get survey data
      const [survey] = await db
        .select()
        .from(surveys)
        .where(eq(surveys.id, input.surveyId))
        .limit(1);

      if (!survey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }

      // Generate recommendations
      const scores = survey.scores as Record<string, { score: number; maxScore: number; interpretation: string }>;
      const recommendations = generateRecommendations(scores);

      // Delete existing recommendations for this survey
      await db
        .delete(surveyRecommendations)
        .where(eq(surveyRecommendations.surveyId, input.surveyId));

      // Insert new recommendations
      const insertedRecommendations = [];
      for (const rec of recommendations) {
        const result = await db
          .insert(surveyRecommendations)
          .values({
            surveyId: input.surveyId,
            section: rec.section,
            recommendation: rec.recommendation,
            priority: rec.priority,
            status: 'pending',
          })
          .returning();
        insertedRecommendations.push(result[0]);
      }

      return insertedRecommendations;
    }),

  // Get recommendations for a survey
  getBySurvey: protectedProcedure
    .input(z.object({ surveyId: z.number() }))
    .query(async ({ input }) => {
      const recommendations = await db
        .select()
        .from(surveyRecommendations)
        .where(eq(surveyRecommendations.surveyId, input.surveyId));

      return recommendations;
    }),

  // Update recommendation status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected', 'modified']),
        recommendation: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updateData: any = {
        status: input.status,
        modifiedBy: ctx.user.userId,
        modifiedAt: new Date(),
      };

      if (input.recommendation) {
        updateData.recommendation = input.recommendation;
      }

      await db
        .update(surveyRecommendations)
        .set(updateData)
        .where(eq(surveyRecommendations.id, input.id));

      const [updated] = await db
        .select()
        .from(surveyRecommendations)
        .where(eq(surveyRecommendations.id, input.id))
        .limit(1);

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recommendation not found',
        });
      }

      return updated;
    }),

  // Update recommendation text
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        recommendation: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db
        .update(surveyRecommendations)
        .set({
          recommendation: input.recommendation,
          status: 'modified',
          modifiedBy: ctx.user.userId,
          modifiedAt: new Date(),
        })
        .where(eq(surveyRecommendations.id, input.id));

      const [updated] = await db
        .select()
        .from(surveyRecommendations)
        .where(eq(surveyRecommendations.id, input.id))
        .limit(1);

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recommendation not found',
        });
      }

      return updated;
    }),

  // Delete recommendation
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(surveyRecommendations)
        .where(eq(surveyRecommendations.id, input.id));

      return { success: true };
    }),
});
