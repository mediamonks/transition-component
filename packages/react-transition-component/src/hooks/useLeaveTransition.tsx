import type { TransitionController } from '@mediamonks/core-transition-component';
import { useLayoutEffect } from 'react';
import { useTransitionPresenceTransitionControllers } from '../components/TransitionPresence';

/**
 * Creates gsap.core.Timeline that will start before component is unmounted
 *
 * @example
 * const myRef = useRef<HTMLDivElement>(null);
 *
 * const controller = useTransitionController(() => ({
 *   ref: myRef,
 *   refs: {
 *     myRef,
 *   },
 *   setupTransitionInTimeline(timeline, { myRef }) { ... },
 *   setupTransitionInTimeline(timeline, { myRef }) { ... },
 * }));
 *
 * // Connect the transitionController to the lifecycle
 * useLeaveTransition(transitionController);
 */
export function useLeaveTransition(transitionController: TransitionController): void {
  const leaveTransitions = useTransitionPresenceTransitionControllers();

  if (leaveTransitions == null) {
    throw new Error(
      'Cannot find leaveTransitions context! Did you forget to wrap the component in a <TransitionPresence />?',
    );
  }

  useLayoutEffect(() => {
    leaveTransitions.add(transitionController);

    return () => {
      leaveTransitions.delete(transitionController);
    };
  }, [transitionController]);
}
