import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import type { SetupScrollTransitionOptions } from '@mediamonks/core-transition-component';
import { useTransitionController } from './useTransitionController';
import type {
  SetupSignatureElements,
  TransitionRef,
  TransitionRefElement,
} from '../types/Transition.types';
import { transitionRefToElement } from '../util/Transition.utils';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransition<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
>(
  container: TransitionRefElement,
  { scrollTrigger = {}, ...restOptions }: SetupScrollTransitionOptions<T, R, E>,
): ReturnType<typeof useTransitionController> {
  const trigger = transitionRefToElement(container);

  const transitionController = useTransitionController<T, R, E>(container, {
    ...restOptions,
    scrollTrigger: { trigger, start: 'top 75%', ...scrollTrigger },
  });

  if (!scrollTrigger.scrub) {
    /**
     * We create another scroll trigger because we want to reset the timeline once the users completely
     * scrolls the component out of the viewport. This way we can re-transition the component when the
     * user scrolls it back into the viewport.
     */
    ScrollTrigger.create({
      trigger,
      onLeaveBack: () => transitionController.transitionTimeline.in.pause(0),
    });
  }

  return transitionController;
}
