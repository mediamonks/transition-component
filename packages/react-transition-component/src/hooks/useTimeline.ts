import gsap from 'gsap';
import { useLayoutEffect, useState } from 'react';
import type { TransitionConfig } from './useTimeline.util';

/**
 * Creates gsap timeline that can be controlled programmatically
 *
 * @example
 * const myRef = useRef<HTMLDivElement>(null);
 * const myTimeline = useTimeline((timeline) => {
 *   timeline.to(myRef.current, { rotation: 360, duration: .5 });
 *
 *   return timeline;
 * }, {}, [])
 */
export function useTimeline(
  decorateTimeline: TransitionConfig['decorateTimeline'],
  timelineVariables?: TransitionConfig['timelineVariables'],
  dependencies?: ReadonlyArray<unknown>,
): gsap.core.Timeline | undefined {
  const [timeline, setTimeline] = useState<gsap.core.Timeline>();

  useLayoutEffect(() => {
    const newTimeline = gsap.timeline({
      ...timelineVariables?.(),
      paused: true,
    });

    decorateTimeline(newTimeline);

    // Set timeline to state so that we can expose the timeline and use it in other components
    setTimeline(newTimeline);

    return () => {
      newTimeline?.kill();
    };
  }, dependencies ?? []);

  return timeline;
}
