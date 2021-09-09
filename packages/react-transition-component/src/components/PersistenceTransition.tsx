import { TransitionControllerContext } from '@mediamonks/core-transition-component';
import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PersistenceTransitionControllerReactContext } from './PersistenceTransition.context';

export interface PersistenceTransitionProps {
  children?: ReactNode | ReadonlyArray<ReactNode>;
}

export function PersistenceTransition({ children }: PersistenceTransitionProps): ReactElement {
  const [previousChildren, setPreviousChildren] = useState<ReactNode>(children);
  const persistanceTransitionControllerContext = useMemo(
    () => new TransitionControllerContext(),
    [],
  );
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        await persistanceTransitionControllerContext.transition({
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
      persistanceTransitionControllerContext.killTransition('in');
      persistanceTransitionControllerContext.killTransition('out');
    },
    [],
  );

  return (
    <PersistenceTransitionControllerReactContext.Provider
      value={persistanceTransitionControllerContext}
    >
      {previousChildren}
    </PersistenceTransitionControllerReactContext.Provider>
  );
}
