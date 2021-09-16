import { normalizeRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

type GridBlockRefs = {
  div: RefObject<HTMLDivElement | null>;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: GridBlockRefs) {
  const { div } = normalizeRefs(refs);

  if (div == null) {
    throw new Error('Cannot find div ref');
  }

  timeline
    .fromTo(
      div,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
    )
    .fromTo(
      div.children,
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        clearProps: 'all',
        stagger: {
          grid: [10, 6],
          from: 'center',
          amount: 1.5,
        },
      },
      0.25,
    );
}
