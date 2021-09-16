import type { TransitionController } from '@mediamonks/core-transition-component';
import { useEffect } from 'react';

/**
 * Creates gsap.core.Timeline that will start as soon the component is mounted
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
 * useEnterTransition(transitionController);
 */
export function useEnterTransition(transitionController: TransitionController): void {
  useEffect(() => {
    transitionController.transitionIn();
  }, [transitionController]);
}
