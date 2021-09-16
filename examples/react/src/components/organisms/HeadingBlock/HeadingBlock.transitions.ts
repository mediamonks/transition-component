import { normalizeRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';
import { SplitText } from '../../../util/SplitText';

type HeadingBlockRefs = {
  heading: RefObject<HTMLHeadingElement | null>;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: HeadingBlockRefs) {
  const { heading } = normalizeRefs(refs);

  const splitHeading = new SplitText(heading);

  timeline.fromTo(
    splitHeading.chars,
    {
      yPercent: -100,
      opacity: 0,
      duration: 0.25,
      ease: 'back',
    },
    {
      yPercent: 0,
      opacity: 1,
      stagger: {
        each: 0.04,
        ease: 'power1.out',
      },
    },
  );
}
