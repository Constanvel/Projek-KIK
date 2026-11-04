'use client';
import { createContext, useContext, useReducer } from 'react';
import { demoReducer, initialState, type DemoAction, type DemoState } from './model';

const DemoContext = createContext<{ state: DemoState; dispatch: React.Dispatch<DemoAction> } | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);
  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo requires DemoProvider');
  return value;
}
