import type { TransitionController } from '@mediamonks/core-transition-component';
import type { ReactElement, ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { createTransitionControllerContext } from '../context/TransitionControllersContext';
import { useIsMounted } from '../hooks/useIsMounted';
import { killTransitionControllersTimelines } from '../lib/killTransitionControllersTimelines';
import { noop } from '../lib/noop';

const { TransitionControllersContext, useTransitionControllers } =
  createTransitionControllerContext();

export const useTransitionPresenceTransitionControllers = useTransitionControllers;

export interface TransitionPresenceProps {
  children: ReactNode;
  crossFlow?: boolean;
}

/**
 * Will transition out old children before replacing with new children
 */
export function TransitionPresence({ children, crossFlow }: TransitionPresenceProps): ReactElement {
  const transitionControllers = useMemo(() => new Set<TransitionController>(), []);
  const [delayedChildren, setDelayedChildren] = useState<ReactNode>(children);

  const isMounted = useIsMounted();

  useLayoutEffect(() => {
    if (children === delayedChildren) {
      return noop;
    }

    (async () => {
      const timelines = Array.from(transitionControllers).map((leaveTransitionController) => {
        return leaveTransitionController.transitionOut();
      });

      await Promise.all(timelines);

      killTransitionControllersTimelines(transitionControllers);

      // Only update children when component is still mounted. Component can
      // unmount while async function is awaiting the transition promise.
      if (isMounted.current) {
        // Always update children, even when error happened during transition
        setDelayedChildren(children);
      }
    })();

    return () => {
      killTransitionControllersTimelines(transitionControllers);
    };
  }, [children, delayedChildren]);

  return (
    <TransitionControllersContext.Provider value={transitionControllers}>
      {delayedChildren}

      {/* Render new children immediately for cross flow transition */}
      {crossFlow && children !== delayedChildren && children}
    </TransitionControllersContext.Provider>
  );
}
