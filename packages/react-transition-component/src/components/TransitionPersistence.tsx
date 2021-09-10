import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { TransitionConfig } from '../hooks/useTimeline.util';
import { createTimelines, killTimelines } from '../hooks/useTimeline.util';

const LeaveTransitionsContext = createContext<Set<TransitionConfig> | undefined>(undefined);

export const useLeaveTransitions = (): Set<TransitionConfig> | undefined =>
  useContext(LeaveTransitionsContext);

export interface TransitionPersistenceProps {
  children: ReactNode;
}

/**
 * Will transition out old children before replacing with new children
 */
export function TransitionPersistence({ children }: TransitionPersistenceProps): ReactElement {
  const leaveTransitions = useMemo(() => new Set<TransitionConfig>(), []);
  const leaveTimelines = useRef<ReadonlyArray<gsap.core.Timeline>>([]);

  const [previousChildren, setPreviousChildren] = useState<ReactNode>(children);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (children === previousChildren) {
      return () => undefined;
    }

    (async () => {
      try {
        leaveTimelines.current = createTimelines(leaveTransitions);

        await Promise.all(leaveTimelines.current);
      } finally {
        // Kill all active timelines if error happened
        killTimelines(leaveTimelines.current);
        leaveTimelines.current = [];

        // Only update children when component is still mounted. Component can
        // unmount while async function is awaiting the transition promise.
        if (isMounted.current) {
          // Always update children, even when error happened during transition
          setPreviousChildren(children);
        }
      }
    })();

    return () => {
      killTimelines(leaveTimelines.current);
      leaveTimelines.current = [];
    };
  }, [children, previousChildren]);

  return (
    <LeaveTransitionsContext.Provider value={leaveTransitions}>
      {previousChildren}
    </LeaveTransitionsContext.Provider>
  );
}
