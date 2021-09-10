import gsap from 'gsap';
import { useLayoutEffect } from 'react';
import type { TransitionConfig } from './useTimeline.util';

/**
 * Creates gsap.core.Timeline that will start as soon as refs are available
 *
 * @example
 * const myRef = useRef<HTMLDivElement>(null);
 *
 * useEnterTimeline((timeline) => {
 *   timeline.to(myRef.current, {
 *     rotation: 360,
 *     duration: 2,
 *   });
 *
 *   return timeline;
 * }, { ...timelineVariables... }, [ ...dependencies... ])
 */
export function useEnterTimeline(
  decorateTimeline: TransitionConfig['decorateTimeline'],
  timelineVariables?: TransitionConfig['timelineVariables'],
  dependencies?: ReadonlyArray<unknown>,
): void {
  useLayoutEffect(() => {
    const timeline = gsap.timeline({
      ...timelineVariables?.(),
      paused: true,
    });

    decorateTimeline(timeline);

    timeline.play();

    return () => {
      timeline.kill();
    };
  }, dependencies ?? []);
}
