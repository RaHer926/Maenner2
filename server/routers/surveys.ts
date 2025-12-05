import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc.js';
import { db } from '../../database/db.js';
import { surveys, patients } from '../../database/schema.js';
import { eq, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const surveysRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          patientId: z.number().optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { patientId, limit = 50, offset = 0 } = input || {};

      let query = db
        .select({
          survey: surveys,
          patient: patients,
        })
        .from(surveys)
        .leftJoin(patients, eq(surveys.patientId, patients.id));

      if (patientId) {
        query = query.where(eq(surveys.patientId, patientId)) as any;
      }

      const result = await query
        .orderBy(desc(surveys.completedAt))
        .limit(limit)
        .offset(offset);

      return result;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          survey: surveys,
          patient: patients,
        })
        .from(surveys)
        .leftJoin(patients, eq(surveys.patientId, patients.id))
        .where(eq(surveys.id, input.id))
        .limit(1);

      if (!result || result.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }

      return result[0];
    }),

  create: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        language: z.string().default('de'),
        answers: z.record(z.string(), z.coerce.number()),
        scores: z.record(z.string(), z.any()),
        totalScore: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify patient exists
      const patient = await db.query.patients.findFirst({
        where: eq(patients.id, input.patientId),
      });

      if (!patient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Patient not found',
        });
      }

      const [newSurvey] = await db
        .insert(surveys)
        .values({
          ...input,
          createdBy: ctx.user?.userId || null,
        })
        .returning();

      return newSurvey;
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(surveys)
        .where(eq(surveys.patientId, input.patientId))
        .orderBy(desc(surveys.completedAt));

      return result;
    }),
});
