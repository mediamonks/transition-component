import { createContext, type RefObject } from 'react';
import type { BeforeUnmountCallback } from '../useBeforeUnmount/useBeforeUnmount.js';

export type TransitionPresenceContextType = Set<RefObject<BeforeUnmountCallback>> | undefined;

export const TransitionPresenceContext = createContext<TransitionPresenceContextType>(undefined);
