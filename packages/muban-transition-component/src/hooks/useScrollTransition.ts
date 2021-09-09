import type {
  SignatureRefElement,
  SetupTransitionOptions,
} from '@mediamonks/core-transition-component';
import { createContext, onUnmounted } from '@muban/muban';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ScrollContext } from '../context/ScrollContext';
import { defaultScrollTriggerVariables } from '../context/ScrollContext';
import type { TransitionRefElement } from '../types/transition.types';
import { addLeaveViewportObserver } from '../util/scroll.utils';
import { transitionRefToElement } from '../util/transition.utils';
import { useTransitionController } from './useTransitionController';

gsap.registerPlugin(ScrollTrigger);

export const [provideScrollContext, useScrollContext] = createContext<ScrollContext | undefined>(
  'scrollContext',
);

export function useScrollTransition(
  container: TransitionRefElement,
  { scrollTrigger = {}, ...restOptions }: SetupTransitionOptions,
): ReturnType<typeof useTransitionController> {
  const trigger: SignatureRefElement = transitionRefToElement(container);

  // If no trigger element is provided we cannot attach any scroll logic, therefore we just return `null`.
  if (!trigger) return null;

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() || {};
  const transitionController = useTransitionController(container, {
    scrollTrigger: {
      trigger,
      ...scrollTriggerVariables,
      ...scrollTrigger,
    },
    ...restOptions,
  });

  const removeLeaveViewportObserver = addLeaveViewportObserver(trigger, (position) => {
    if (!scrollTrigger.scrub && position === 'bottom') {
      transitionController?.transitionTimeline.in.pause(0, false);
    }
  });

  onUnmounted(removeLeaveViewportObserver);

  return transitionController;
}
