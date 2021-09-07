import type { ReactNode } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  TransitionPersistenceContext,
  TransitionPersistenceReactContext,
} from './TransitionPersistence.context';

export interface TransitionPersistenceProps {
  children: ReactNode;
}

export function TransitionPersistence({ children }: TransitionPersistenceProps): ReactNode {
  const [previousChildren, setChildren] = useState<ReactNode>(children);
  const transitionPersistanceContext = useMemo(() => new TransitionPersistenceContext(), []);
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      /**
       * Children are rendered if previousChildren and children are the same,
       * this is when we can start the _in_ transition.
       */
      if (previousChildren === children) {
        await transitionPersistanceContext.transition({
          direction: 'in',
        });

        return;
      }

      try {
        await transitionPersistanceContext.transition({
          direction: 'out',
        });
      } finally {
        // Only update children when component is still mounted. Component can
        // unmount while async function is awaiting the transition promise.
        if (isMounted.current) {
          // Always update children, even when error happened during transition
          setChildren(children);
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
      {children}
    </TransitionPersistenceReactContext.Provider>
  );
}
