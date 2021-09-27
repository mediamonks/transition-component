import { unwrapRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

type AboutRefs = {
  div: RefObject<HTMLElement>;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: AboutRefs) {
  const { div } = unwrapRefs(refs);

  timeline.fromTo(
    div,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1,
    },
  );
}

export function setupTransitionOutTimeline(timeline: gsap.core.Timeline, refs: AboutRefs) {
  const { div } = unwrapRefs(refs);

  timeline.to(div, {
    opacity: 0,
    duration: 1,
  });
}
