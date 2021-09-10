import { useLayoutEffect } from 'react';
import { useLeaveTransitions } from '../components/TransitionPersistence';
import type { TransitionConfig } from './useTimeline.util';

/**
 * Creates gsap.core.Timeline that will start before component is unmounted
 *
 * @example
 * const myRef = useRef<HTMLDivElement>(null);
 *
 * useLeaveTimeline((timeline) => {
 *   timeline.to(myRef.current, {
 *     rotation: 360,
 *     duration: 2,
 *   });
 *
 *   return timeline;
 * }, { ...timelineVariables... }, [ ...dependencies... ])
 */
export function useLeaveTimeline(
  decorateTimeline: TransitionConfig['decorateTimeline'],
  timelineVariables?: TransitionConfig['timelineVariables'],
  dependencies?: ReadonlyArray<unknown>,
): void {
  const leaveTransitions = useLeaveTransitions();

  if (leaveTransitions == null) {
    throw new Error(
      'Cannot find leave transitions context! Did you forget to wrap the component in a <PersistenceTransition />?',
    );
  }

  useLayoutEffect(() => {
    const leaveTransition: TransitionConfig = {
      decorateTimeline,
      timelineVariables,
    };

    leaveTransitions.add(leaveTransition);

    return () => {
      leaveTransitions.delete(leaveTransition);
    };
  }, dependencies ?? []);
}
