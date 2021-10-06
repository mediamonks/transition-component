import type { TransitionController } from '@mediamonks/core-transition-component';
import { useEffect } from 'react';

/**
 * Creates gsap.core.Timeline on mount
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
 * useScrollTransition(transitionController);
 */
export function useScrollTransition(transitionController: TransitionController): void {
  useEffect(() => {
    transitionController.setupTimeline({
      direction: 'in',
    });
  }, [transitionController]);
}
