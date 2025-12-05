import { router } from './trpc.js';
import { authRouter } from './routers/auth.js';
import { patientsRouter } from './routers/patients.js';
import { surveysRouter } from './routers/surveys.js';
import { recommendationsRouter } from './routers/recommendations.js';

export const appRouter = router({
  auth: authRouter,
  patients: patientsRouter,
  surveys: surveysRouter,
  recommendations: recommendationsRouter,
});

export type AppRouter = typeof appRouter;
