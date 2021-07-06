import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { createContext, onUnmounted } from '@muban/muban';
import type { SignatureRefElement } from '@mediamonks/core-transition-component';
import { useTransitionController } from './useTransitionController';
import type {
  SetupTransitionOptions,
  SetupSignatureElements,
  TransitionRef,
  TransitionRefElement,
} from '../types/Transition.types';
import { transitionRefToElement } from '../util/Transition.utils';
import type { ScrollContext } from '../context/ScrollContext';
import { defaultScrollTriggerVariables } from '../context/ScrollContext';
import { addLeaveViewportObserver } from '../util/scroll.utils';

gsap.registerPlugin(ScrollTrigger);

export const [provideScrollContext, useScrollContext] = createContext<ScrollContext | undefined>(
  'scrollContext',
);

export function useScrollTransition<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
>(
  container: TransitionRefElement,
  { scrollTrigger = {}, ...restOptions }: SetupTransitionOptions<T, R, E>,
): ReturnType<typeof useTransitionController> {
  const trigger: SignatureRefElement = transitionRefToElement(container);

  if (!trigger)
    throw new Error('No container element was provided, please make sure to provide one.');

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() || {};

  const transitionController = useTransitionController<T, R, E>(container, {
    registerTransitionController: false,
    scrollTrigger: { trigger, ...scrollTriggerVariables, ...scrollTrigger },
    ...restOptions,
  });

  const removeLeaveViewportObserver = addLeaveViewportObserver(trigger, (position) => {
    if (!scrollTrigger.scrub && position === 'bottom') {
      transitionController.transitionTimeline.in.pause(0, false);
    }
  });

  onUnmounted(removeLeaveViewportObserver);

  return transitionController;
}
