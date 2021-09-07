import { createContext, useContext } from 'react';
import { TransitionControllerContext } from '@mediamonks/core-transition-component';

export class TransitionPersistenceContext extends TransitionControllerContext {}

export const TransitionPersistenceReactContext = createContext<
  TransitionPersistenceContext | undefined
>(undefined);

export const useTransitionPersistenceContext = (): TransitionPersistenceContext | undefined =>
  useContext(TransitionPersistenceReactContext);
