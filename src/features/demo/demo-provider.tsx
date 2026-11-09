'use client';
import { createContext, useContext, useEffect, useReducer } from 'react';
import {
  demoReducer,
  initialState,
  parseStoredState,
  type DemoAction,
  type DemoState,
} from './model';

// sessionStorage: survives refresh, cleared when the tab closes (safer on shared devices).
// Stores only clinic, doctor, schedule, sample ticket and stage; no name or medical record.
export const DEMO_STORAGE_KEY = 'hytrack-demo-visit';
const DemoContext = createContext<{
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
  ready: boolean;
} | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  // `ready` flips with the restore in one update, so pages never render the pre-restore state.
  const [{ state, ready }, dispatch] = useReducer(
    (current: { state: DemoState; ready: boolean }, action: DemoAction) => ({
      state: demoReducer(current.state, action),
      ready: current.ready || action.type === 'restore',
    }),
    { state: initialState, ready: false },
  );
  useEffect(() => {
    let stored: DemoState | null = null;
    try {
      stored = parseStoredState(sessionStorage.getItem(DEMO_STORAGE_KEY));
    } catch {}
    dispatch({ type: 'restore', state: stored ?? initialState });
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);
  return <DemoContext.Provider value={{ state, dispatch, ready }}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo requires DemoProvider');
  return value;
}
