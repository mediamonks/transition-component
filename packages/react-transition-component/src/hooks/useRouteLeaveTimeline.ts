import { useLayoutEffect } from 'react';
import type { TransitionConfig } from './useTimeline.util';

export const ROUTE_LEAVE_TRANSITIONS = new Set<TransitionConfig>();

/**
 * Creates gsap.core.Timeline that will start before TransitionRoute is unmounted
 *
 * @example
 * const myRef = useRef<HTMLDivElement>(null);
 *
 * useRouteLeaveTimeline((timeline) => {
 *   timeline.to(myRef.current, {
 *     rotation: 360,
 *     duration: 2,
 *   });
 *
 *   return timeline;
 * }, { ...timelineVariables... }, [ ...dependencies... ])
 */
export function useRouteLeaveTimeline(
  decorateTimeline: TransitionConfig['decorateTimeline'],
  timelineVariables?: TransitionConfig['timelineVariables'],
  dependencies?: ReadonlyArray<unknown>,
): void {
  useLayoutEffect(() => {
    const pageLeaveTransition: TransitionConfig = {
      decorateTimeline,
      timelineVariables,
    };

    ROUTE_LEAVE_TRANSITIONS.add(pageLeaveTransition);

    return () => {
      ROUTE_LEAVE_TRANSITIONS.delete(pageLeaveTransition);
    };
  }, dependencies ?? []);
}
