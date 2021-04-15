import type { TransitionRefElement } from '@mediamonks/muban-transition-component/src/types/Transition.types';
import type { SetupTransitionSignature } from '@mediamonks/core-transition-component';

type TransitionRefs = {
  title: TransitionRefElement;
};

export const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline,
  { container },
) => {
  timeline.fromTo(container, { scale: 0 }, { scale: 1, duration: 1, ease: 'Bounce.easeOut' });
};
