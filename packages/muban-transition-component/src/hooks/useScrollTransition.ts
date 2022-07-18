import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ComponentRef, ElementRef } from '@muban/muban';
import { onUnmounted } from '@muban/muban';
import { transitionRefToElement } from '../utils/transitionRefToElement';
import { useTransitionController } from './useTransitionController';
import type { SetupTransitionOptions } from '../types/transition.types';
import { defaultScrollTriggerVariables, useScrollContext } from '../context/ScrollTriggerContext';
import { addLeaveViewportObserver } from '../utils/scroll.utils';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransition<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: ComponentRef<any> | ElementRef<any, any>,
  { timelineVars, ...restOptions }: SetupTransitionOptions<T>,
): ReturnType<typeof useTransitionController> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger = transitionRefToElement((container as unknown) as any);

  if (trigger == null) {
    throw new Error('container is required as ScrollTrigger trigger');
  }

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() || {};

  const scrollTrigger = timelineVars?.().scrollTrigger as ScrollTrigger.Vars | undefined;
  const transitionController = useTransitionController({
    ...restOptions,
    ref: trigger,
    timelineVars: () => ({
      ...timelineVars?.(),
      scrollTrigger: {
        ...scrollTriggerVariables,
        ...scrollTrigger,
        trigger,
      },
    }),
  });

  const removeLeaveViewportObserver = addLeaveViewportObserver(trigger, (position) => {
    if (!scrollTrigger?.scrub && !scrollTrigger?.once && position === 'bottom') {
      transitionController.getTimeline('in')?.pause(0, false);
    }
  });

  onUnmounted(removeLeaveViewportObserver);

  return transitionController;
}
