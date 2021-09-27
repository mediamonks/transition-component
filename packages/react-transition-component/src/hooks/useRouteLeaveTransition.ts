import type { TransitionController } from '@mediamonks/core-transition-component';
import { useLayoutEffect } from 'react';
import { useTransitionRouteTransitionControllers } from '../components/TransitionRoute';

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
  const transitionControllers = useTransitionRouteTransitionControllers();

  if (transitionControllers == null) {
    throw new Error('Cannot use useRouteLeaveTransition outside of a <TransitionRoute />');
  }

  useLayoutEffect(() => {
    transitionControllers.add(transitionController);

    return () => {
      transitionControllers.delete(transitionController);
    };
  }, [transitionController]);
}
