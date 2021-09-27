import { unwrapRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';
import { SplitText } from '../../../util/SplitText';

type HeadingBlockRefs = {
  mainRef: RefObject<HTMLHeadingElement | null>;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: HeadingBlockRefs) {
  const { mainRef } = unwrapRefs(refs);

  const mainSplit = new SplitText(mainRef);

  timeline.fromTo(
    [...mainSplit.chars.reverse()],
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
