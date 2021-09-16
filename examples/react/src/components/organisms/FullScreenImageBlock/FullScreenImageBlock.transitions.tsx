import { normalizeRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

type FullscreenImageBlockRefs = {
  image: RefObject<HTMLImageElement | null>;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  refs: FullscreenImageBlockRefs,
) {
  const { image } = normalizeRefs(refs);

  timeline.fromTo(
    image,
    {
      yPercent: -10,
      scale: 1.2,
    },
    {
      yPercent: 10,
      duration: 1,
      ease: 'power1.inOut',
    },
    0,
  );
}
