import { normalizeRefs } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

type MyTransitionComponentRefs = {
  div: RefObject<HTMLDivElement | null>;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  refs: MyTransitionComponentRefs,
) {
  const { div } = normalizeRefs(refs);

  timeline
    .fromTo(
      div,
      {
        scale: 0,
      },
      {
        rotation: 45,
        scaleY: 1,
        scaleX: 0.5,
      },
    )
    .to(div, {
      scale: 1,
      rotation: 0,
    });
}

export function setupTransitionOutTimeline(
  timeline: gsap.core.Timeline,
  refs: MyTransitionComponentRefs,
) {
  const { div } = normalizeRefs(refs);

  timeline.to(div, {
    x: 0,
    scale: 1.5,
    rotation: -270,
    duration: 1,
  });
}
