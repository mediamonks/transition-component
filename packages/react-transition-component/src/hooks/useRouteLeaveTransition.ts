import type { TransitionController } from '@mediamonks/core-transition-component';
import { useLayoutEffect } from 'react';

export const ROUTE_LEAVE_TRANSITION_CONTROLLERS = new Set<TransitionController>();

/**
 * Connects transitionController so that it will transitionOut before component
 * is unmounted on navigation.
 *
 * Note: this doesn't work for nested <Route /> components (yet)/
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
 * useRouteLeaveTimeline(transitionController);
 */
export function useRouteLeaveTransition(transitionController: TransitionController): void {
  useLayoutEffect(() => {
    ROUTE_LEAVE_TRANSITION_CONTROLLERS.add(transitionController);

    return () => {
      ROUTE_LEAVE_TRANSITION_CONTROLLERS.delete(transitionController);
    };
  }, [transitionController]);
}
