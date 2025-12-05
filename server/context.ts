import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyToken, JWTPayload } from '../auth/jwt.js';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  let user: JWTPayload | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      user = verifyToken(token);
    } catch (error) {
      // Token is invalid or expired
      user = null;
    }
  }

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
