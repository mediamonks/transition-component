import { createContext, useContext } from 'react';
import type { BeforeUnmountCallback } from '../useBeforeUnmount/useBeforeUnmount.js';

export type TransitionPresenceContextType = Set<BeforeUnmountCallback> | undefined;

export const TransitionPresenceContext = createContext<TransitionPresenceContextType>(undefined);

export function useTransitionPresence(): TransitionPresenceContextType {
  return useContext(TransitionPresenceContext);
}
