/* eslint-disable unicorn/prevent-abbreviations */
import type { SignatureRefElement } from '@mediamonks/core-transition-component';
import { createContext, onUnmounted } from '@muban/muban';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ScrollContext } from '../context/ScrollContext';
import { defaultScrollTriggerVariables } from '../context/ScrollContext';
import type {
  SetupSignatureElements,
  SetupTransitionOptions,
  TransitionRef,
  TransitionRefElement,
} from '../types/transition.types';
import { addLeaveViewportObserver } from '../util/scroll.utils';
import { transitionRefToElement } from '../util/transitionRefToElement';
import { useTransitionController } from './useTransitionController';

gsap.registerPlugin(ScrollTrigger);

export const [provideScrollContext, useScrollContext] = createContext<ScrollContext | undefined>(
  'scrollContext',
);

export function useScrollTransition<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
>(
  container: TransitionRefElement,
  { scrollTrigger = {}, ...restOptions }: SetupTransitionOptions<T, R, E>,
): ReturnType<typeof useTransitionController> {
  const trigger: SignatureRefElement = transitionRefToElement(container);

  // If no trigger element is provided we cannot attach any scroll logic, therefore we just return `null`.
  if (!trigger) {
    return null;
  }

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() ?? {};
  const transitionController = useTransitionController<T, R, E>(container, {
    registerTransitionController: false,
    scrollTrigger: { trigger, ...scrollTriggerVariables, ...scrollTrigger },
    ...restOptions,
  });

  const removeLeaveViewportObserver = addLeaveViewportObserver(trigger, (position) => {
    if (!scrollTrigger.scrub && !scrollTrigger.once && position === 'bottom') {
      transitionController?.transitionTimeline.in.pause(0, false);
    }
  });

  onUnmounted(removeLeaveViewportObserver);

  return transitionController;
}
