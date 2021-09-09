import type { SetupTransitionSignature } from '@mediamonks/core-transition-component';
import type { TransitionRefElement } from '@mediamonks/muban-transition-component';
import { TRANSITION_CONTROLLER_CONTEXT } from '@mediamonks/muban-transition-component';

type TransitionRefs = {
  self: TransitionRefElement;
  bar: TransitionRefElement;
};

export const setupTransitionInTimeline = ({
  self,
  bar,
}: TransitionRefs): SetupTransitionSignature => (timeline) => {
  timeline.set(self, { scale: 1 });
  timeline.fromTo(self, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'linear.easeNone' });
  timeline.fromTo(self, { y: 300 }, { y: 0, duration: 1, ease: 'Expo.easeOut' }, '<');
  timeline.add(TRANSITION_CONTROLLER_CONTEXT.findTransitionController(bar)?.getTimeline());
};

export const setupTransitionOutTimeline = ({ self }: TransitionRefs): SetupTransitionSignature => (
  timeline,
) => {
  timeline.to(self, { scale: 1.5, duration: 0.4, ease: 'expo.easeOut' });
  timeline.to(self, { autoAlpha: 0, duration: 0.4 }, '<');
};
