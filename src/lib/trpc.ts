import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/index';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  // In production, use the current domain; in development, use localhost
  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:3001/trpc'
    : `${window.location.origin}/trpc`;

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
