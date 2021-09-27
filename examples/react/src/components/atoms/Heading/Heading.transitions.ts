import { unwrapRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

type HeadingBlockRefs = {
  mainRef: RefObject<HTMLHeadingElement | null>;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: HeadingBlockRefs) {
  const { mainRef } = unwrapRefs(refs);

  timeline.fromTo(
    mainRef,
    {
      xPercent: -100,
      opacity: 0,
      duration: 0.05,
      color: '#0000ff',
    },
    {
      xPercent: 0,
      opacity: 1,
      color: '#ffffff',
      stagger: {
        each: 0.05,
        ease: 'power1.out',
      },
    },
  );
}
