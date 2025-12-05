import { pgTable, serial, varchar, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

// Users table (doctors/staff with authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('doctor'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Patients table
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  patientNumber: varchar('patient_number', { length: 100 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  patientNumberIdx: index('patients_patient_number_idx').on(table.patientNumber),
  lastNameIdx: index('patients_last_name_idx').on(table.lastName),
}));

// Surveys table (questionnaire responses)
export const surveys = pgTable('surveys', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  language: varchar('language', { length: 10 }).notNull().default('de'),
  answers: jsonb('answers').notNull(),
  scores: jsonb('scores').notNull(),
  totalScore: integer('total_score'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdBy: integer('created_by').references(() => users.id),
  notes: text('notes'),
}, (table) => ({
  patientIdIdx: index('surveys_patient_id_idx').on(table.patientId),
  completedAtIdx: index('surveys_completed_at_idx').on(table.completedAt),
}));

// Recommendations table
export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  section: varchar('section', { length: 50 }).notNull(),
  minScore: integer('min_score').notNull(),
  maxScore: integer('max_score').notNull(),
  recommendation: text('recommendation').notNull(),
  supplements: jsonb('supplements'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sectionIdx: index('recommendations_section_idx').on(table.section),
}));

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: integer('entity_id'),
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));
