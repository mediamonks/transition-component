import type { History, State } from 'history';
import { createBrowserHistory } from 'history';
import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { Router } from 'react-router-dom';
import {
  TransitionRouterContext,
  TransitionRouterReactContext,
  useTransitionRouterContext,
} from './TransitionRouter.context';

export interface TransitionRouterProps {
  children: ReactNode | ReadonlyArray<ReactNode>;
  history?: History<State>;
}

export const DEFAULT_HISTORY = createBrowserHistory();

export function TransitionRouter({
  children,
  history = DEFAULT_HISTORY,
}: TransitionRouterProps): ReactElement {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const _transitionRouterContext = useTransitionRouterContext();

  if (_transitionRouterContext) {
    throw new Error('TransitionRouter cannot be a child of another TransitionRouter');
  }

  const transitionRouterContext = useMemo(() => new TransitionRouterContext(), []);

  useEffect(() => {
    /**
     * Reference to unblock function that we must invoke when TransitionRouter is
     * unmounted or when history changes.
     */
    let unblock: (() => void) | undefined;

    // TODO: Check if this function is called *before* react router content changes, we need to create a
    // wrapper for the Link in react-router-dom if the listen callback is called after route change
    const disposeListen = history.listen(() => {
      unblock = history.block(() => {
        if (transitionRouterContext == null) {
          throw new Error('transitionRouterContext is undefined');
        }

        (async () => {
          try {
            // Do out transition before history change
            await transitionRouterContext.transition({
              direction: 'out',
            });
          } finally {
            unblock?.();
          }
        })();
      });
    });

    return () => {
      disposeListen();
      unblock?.();
    };
  }, [history]);

  useEffect(
    () => () => {
      // Kill transitions before unmounting
      transitionRouterContext.killTransition('in');
      transitionRouterContext.killTransition('out');
    },
    [],
  );

  return (
    <Router
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      history={(history as unknown) as any}
    >
      <TransitionRouterReactContext.Provider value={transitionRouterContext}>
        {children}
      </TransitionRouterReactContext.Provider>
    </Router>
  );
}
