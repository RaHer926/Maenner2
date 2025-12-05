import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc.js';
import { db } from '../../database/db.js';
import { patients } from '../../database/schema.js';
import { eq, desc, like, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const patientsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { search, limit = 50, offset = 0 } = input || {};

      let query = db.select().from(patients);

      if (search) {
        query = query.where(
          or(
            like(patients.firstName, `%${search}%`),
            like(patients.lastName, `%${search}%`),
            like(patients.email, `%${search}%`),
            like(patients.patientNumber, `%${search}%`)
          )
        ) as any;
      }

      const result = await query
        .orderBy(desc(patients.createdAt))
        .limit(limit)
        .offset(offset);

      return result;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const patient = await db.query.patients.findFirst({
        where: eq(patients.id, input.id),
      });

      if (!patient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Patient not found',
        });
      }

      return patient;
    }),

  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('Creating patient with input:', JSON.stringify(input));
        
        // Insert patient and get the returned row with ID
        const [newPatient] = await db
          .insert(patients)
          .values(input)
          .returning();
        
        console.log('New patient created:', JSON.stringify(newPatient));
        
        // Update patient number to equal ID
        const patientNumber = String(newPatient.id);
        const [updatedPatient] = await db
          .update(patients)
          .set({ patientNumber })
          .where(eq(patients.id, newPatient.id))
          .returning();
        
        console.log('Patient number updated:', JSON.stringify(updatedPatient));
        return updatedPatient;
      } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        patientNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      await db
        .update(patients)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(patients.id, id));

      const [updatedPatient] = await db
        .select()
        .from(patients)
        .where(eq(patients.id, id))
        .limit(1);

      if (!updatedPatient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Patient not found',
        });
      }

      return updatedPatient;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const [existingPatient] = await db
        .select()
        .from(patients)
        .where(eq(patients.id, input.id))
        .limit(1);

      if (!existingPatient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Patient not found',
        });
      }

      await db
        .delete(patients)
        .where(eq(patients.id, input.id));

      return { success: true };
    }),
});
