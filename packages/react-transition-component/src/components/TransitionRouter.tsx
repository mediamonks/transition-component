import type { History } from 'history';
import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { Router } from 'react-router-dom';
import {
  TransitionRouterContext,
  TransitionRouterReactContext,
  useTransitionRouterContext,
} from './TransitionRouter.context';
import { createTransitionHistory } from './TransitionRouter.util';

export interface TransitionRouterProps {
  children: ReactNode | ReadonlyArray<ReactNode>;
  history: History;
}

export function TransitionRouter({ children, history }: TransitionRouterProps): ReactElement {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const _transitionRouterContext = useTransitionRouterContext();

  if (_transitionRouterContext) {
    throw new Error('TransitionRouter cannot be a child of another TransitionRouter');
  }

  const transitionRouterContext = useMemo(() => new TransitionRouterContext(), []);

  /**
   * Decorates function in history so that we can transition out before
   * changing routes
   */
  const transitionHistory = useMemo(
    () => createTransitionHistory(history, transitionRouterContext),
    [transitionRouterContext],
  );

  useEffect(
    () => () => {
      transitionRouterContext.killTransition('in');
      transitionRouterContext.killTransition('out');
    },
    [],
  );

  return (
    <TransitionRouterReactContext.Provider value={transitionRouterContext}>
      <Router
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        history={(transitionHistory as unknown) as any}
      >
        {children}
      </Router>
    </TransitionRouterReactContext.Provider>
  );
}
