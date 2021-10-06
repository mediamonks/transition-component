import type { SetupTransitionOptions } from '@mediamonks/core-transition-component';
import type { ComponentRef, ElementRef } from '@muban/muban/lib/refs/refDefinitions.types';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { getDefaultScrollTriggerVariables } from '../context/defaultScrollTriggerVariables';
import { transitionRefToElement } from '../util/transitionRefToElement';
import { useTransitionController } from './useTransitionController';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransition<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: ComponentRef<any> | ElementRef<any, any>,
  { timelineVars, ...restOptions }: SetupTransitionOptions<T>,
): ReturnType<typeof useTransitionController> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger = transitionRefToElement(container as unknown as any);

  if (trigger == null) {
    throw new Error('container is required as ScrollTrigger trigger');
  }

  return useTransitionController({
    ...restOptions,
    ref: trigger,
    timelineVars: () => ({
      ...timelineVars?.(),
      scrollTrigger: {
        ...getDefaultScrollTriggerVariables(),
        ...(timelineVars?.().scrollTrigger as ScrollTrigger.Vars),
        trigger,
      },
    }),
  });
}
