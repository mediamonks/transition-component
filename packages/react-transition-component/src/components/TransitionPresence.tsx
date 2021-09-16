import type { TransitionController } from '@mediamonks/core-transition-component';
import type { ReactElement, ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useIsMounted } from '../hooks/useIsMounted';
import { noop } from '../lib/noop';
import { LeaveTransitionControllersContext } from './TransitionPresence.context';
import { killTransitionControllerTimelines } from './TransitionPresence.util';

export interface TransitionPresenceProps {
  children: ReactNode;
}

/**
 * Will transition out old children before replacing with new children
 */
export function TransitionPresence({ children }: TransitionPresenceProps): ReactElement {
  const leaveTransitionControllers = useMemo(() => new Set<TransitionController>(), []);
  const [delayedChildren, setDelayedChildren] = useState<ReactNode>(children);

  const isMounted = useIsMounted();

  useLayoutEffect(() => {
    if (children === delayedChildren) {
      return noop;
    }

    const timelines = Array.from(leaveTransitionControllers).map((leaveTransitionController) => {
      return leaveTransitionController.transitionOut();
    });

    (async () => {
      try {
        await Promise.all(timelines);
      } finally {
        killTransitionControllerTimelines(leaveTransitionControllers);

        // Only update children when component is still mounted. Component can
        // unmount while async function is awaiting the transition promise.
        if (isMounted.current) {
          // Always update children, even when error happened during transition
          setDelayedChildren(children);
        }
      }
    })();

    return () => {
      killTransitionControllerTimelines(leaveTransitionControllers);
    };
  }, [children, delayedChildren]);

  return (
    <LeaveTransitionControllersContext.Provider value={leaveTransitionControllers}>
      {delayedChildren}
    </LeaveTransitionControllersContext.Provider>
  );
}
