import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/index';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  // Use relative URL in production, localhost in development
  const apiUrl = import.meta.env.PROD 
    ? '/trpc' 
    : 'http://localhost:3001/trpc';

  return trpc.createClient({
    links: [
      httpBatchLink({
        url: apiUrl,
        headers() {
          const token = localStorage.getItem('auth_token');
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
