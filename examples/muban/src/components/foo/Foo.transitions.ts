import type { SetupTransitionSignature } from '@mediamonks/core-transition-component';
import type { TransitionRefElement } from '@mediamonks/muban-transition-component';

type TransitionRefs = {
  bar: TransitionRefElement;
};

export const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline,
  { container, bar },
  transitionContext,
) => {
  timeline.set(container, { scale: 1 });
  timeline.fromTo(
    container,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.4, ease: 'linear.easeNone' },
  );
  timeline.fromTo(container, { y: 300 }, { y: 0, duration: 1, ease: 'Expo.easeOut' }, '<');
  timeline.add(transitionContext.getTimeline(bar));
};

export const setupTransitionOutTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline,
  { container },
) => {
  timeline.to(container, { scale: 1.5, duration: 0.4, ease: 'expo.easeOut' });
  timeline.to(container, { autoAlpha: 0, duration: 0.4 }, '<');
};
