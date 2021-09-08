import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  TransitionPersistenceContext,
  TransitionPersistenceReactContext,
} from './TransitionPersistence.context';

export interface TransitionPersistenceProps {
  children?: ReactNode | ReadonlyArray<ReactNode>;
}

export function TransitionPersistence({ children }: TransitionPersistenceProps): ReactElement {
  const [previousChildren, setPreviousChildren] = useState<ReactNode>(children);
  const transitionPersistanceContext = useMemo(() => new TransitionPersistenceContext(), []);
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        await transitionPersistanceContext.transition({
          direction: previousChildren === children ? 'in' : 'out',
        });
      } finally {
        // Only update children when component is still mounted. Component can
        // unmount while async function is awaiting the transition promise.
        if (isMounted.current) {
          // Always update children, even when error happened during transition
          setPreviousChildren(children);
        }
      }
    })();
  }, [children, previousChildren]);

  useEffect(
    () => () => {
      isMounted.current = false;

      // Kill transitions before unmounting
      transitionPersistanceContext.killTransition('in');
      transitionPersistanceContext.killTransition('out');
    },
    [],
  );

  return (
    <TransitionPersistenceReactContext.Provider value={transitionPersistanceContext}>
      {previousChildren}
    </TransitionPersistenceReactContext.Provider>
  );
}
