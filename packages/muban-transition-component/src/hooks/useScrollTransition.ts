import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ComponentFactory, ComponentRef, ElementRef } from '@muban/muban';
import { onUnmounted } from '@muban/muban';
import { useTransitionController } from './useTransitionController';
import type { SetupTransitionOptions } from '../types/transition.types';
import { defaultScrollTriggerVariables, useScrollContext } from '../context/ScrollTriggerContext';
import { addLeaveViewportObserver } from '../utils/scroll.utils';
import { unwrapRef } from '../utils/ref.utils';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransition<T>(
  container: ElementRef | ComponentRef<ComponentFactory>,
  { timelineVars, ...restOptions }: SetupTransitionOptions<T>,
): ReturnType<typeof useTransitionController> {
  const trigger = unwrapRef(container);

  if (!trigger) throw new Error('container is required as ScrollTrigger trigger');

  const { scrollTriggerVariables = defaultScrollTriggerVariables } = useScrollContext() || {};

  const scrollTrigger = timelineVars?.().scrollTrigger as ScrollTrigger.Vars | undefined;
  const transitionController = useTransitionController({
    ...restOptions,
    ref: container,
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
      transitionController.getTimeline('in', true)?.pause(0, false);
    }
  });

  onUnmounted(removeLeaveViewportObserver);

  return transitionController;
}
