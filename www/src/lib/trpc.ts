import { createTRPCSolid } from 'solid-trpc';
import type { AppRouter } from '@kafeasist/api/src/app';

export const trpc = createTRPCSolid<AppRouter>();
