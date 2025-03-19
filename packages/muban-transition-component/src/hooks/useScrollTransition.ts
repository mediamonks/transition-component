/* eslint-disable unicorn/prevent-abbreviations */
import { createContext } from '@muban/muban';
import gsap from 'gsap';
// @ts-expect-error - ScrollTriggered is not declared for ESM import
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import type { ScrollContext } from '../context/ScrollContext.js';
import { defaultScrollTriggerVariables } from '../context/ScrollContext.js';
import type {
  SetupSignatureElements,
  SetupTransitionOptions,
  TransitionRef,
  TransitionRefElement,
} from '../types/transition.types.js';
import { transitionRefToElement } from '../util/transitionRefToElement.js';
import { useTransitionController } from './useTransitionController.js';

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
  const trigger = transitionRefToElement(container);

  // If no trigger element is provided we cannot attach any scroll logic, therefore we just return `null`.
  if (!trigger) {
    return null;
  }

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() ?? {};
  const transitionController = useTransitionController<T, R, E>(container, {
    registerTransitionController: false,
    scrollTrigger: {
      trigger,
      ...scrollTriggerVariables,
      ...scrollTrigger,
    },
    ...restOptions,
  });

  return transitionController;
}
