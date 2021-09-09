import { createContext, useContext } from 'react';
import type { TransitionControllerContext } from '@mediamonks/core-transition-component';

export const PersistenceTransitionControllerReactContext = createContext<
  TransitionControllerContext | undefined
>(undefined);

export const usePersistenceTransitionControllerContext = ():
  | TransitionControllerContext
  | undefined => useContext(PersistenceTransitionControllerReactContext);
