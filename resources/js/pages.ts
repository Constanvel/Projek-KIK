import type { ComponentType } from 'react';
import { ErrorPage } from '@/features/errors/error-page';

// Component names rendered by Laravel controllers via Inertia::render().
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pages: Record<string, ComponentType<any>> = {
  ErrorPage,
};
