import { createContext, useContext, type RefObject } from 'react';
import type { BeforeUnmountCallback } from '../useBeforeUnmount/useBeforeUnmount.js';

export type TransitionPresenceContextType = Set<RefObject<BeforeUnmountCallback>> | undefined;

export const TransitionPresenceContext = createContext<TransitionPresenceContextType>(undefined);

export function useTransitionPresence(): TransitionPresenceContextType {
  const context = useContext(TransitionPresenceContext);

  if (context === undefined) {
    // eslint-disable-next-line no-console
    console.warn('Component is not rendered in the context of a TransitionPresence');
  }

  return context;
}
