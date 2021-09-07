import { createContext, useContext } from 'react';
import { TransitionPersistenceContext } from './TransitionPersistence.context';

/**
 * Context works the same as TransitionPersistanceContext but we create a new
 * instance so that we can distinguish between the two context types
 */
export class TransitionRouterContext extends TransitionPersistenceContext {}

/**
 * React context for TransitionRouterContext
 */
export const TransitionRouterReactContext = createContext<TransitionRouterContext | undefined>(
  undefined,
);

/**
 * Hook for easy access to TransitionRouterReactContext
 */
export const useTransitionRouterContext = (): TransitionRouterContext | undefined =>
  useContext(TransitionRouterReactContext);
