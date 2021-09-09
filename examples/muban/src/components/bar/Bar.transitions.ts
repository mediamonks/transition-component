import type {
  SetupTransitionSignature,
  TransitionRefElement,
} from '@mediamonks/muban-transition-component';

type TransitionRefs = {
  self: TransitionRefElement;
  title: TransitionRefElement;
};

export const setupTransitionInTimeline = ({ self }: TransitionRefs): SetupTransitionSignature => (
  timeline,
) => {
  timeline.fromTo(self, { scale: 0 }, { scale: 1, duration: 1, ease: 'Bounce.easeOut' });
};
