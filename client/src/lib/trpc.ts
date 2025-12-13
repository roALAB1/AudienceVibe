/**
 * tRPC Client Setup
 * 
 * Provides type-safe API calls from React components to tRPC routes
 */

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/routers';

export const trpc = createTRPCReact<AppRouter>();
