import { normalizeRefs, TransitionController } from '@mediamonks/react-transition-component';
import { RefObject } from 'react';

export type HomeTransitionRefs = {
  div: RefObject<HTMLDivElement | null>;
  heading: RefObject<HTMLHeadingElement | null>;
  headingTransitionController: TransitionController | undefined;
};

export function setupTransitionInTimeline(timeline: gsap.core.Timeline, refs: HomeTransitionRefs) {
  const { div, heading, headingTransitionController } = normalizeRefs(refs);

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
    })
    .fromTo(
      heading,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
      },
    );

  if (headingTransitionController) {
    timeline.add(headingTransitionController.getTimeline('in'));
  }

  return timeline;
}
