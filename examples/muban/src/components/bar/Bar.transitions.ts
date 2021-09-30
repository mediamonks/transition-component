import type {
  SetupTransitionSignature,
  TransitionRefElement,
} from '@mediamonks/muban-transition-component';

type TransitionRefs = {
  title: TransitionRefElement;
};

export const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (
  timeline,
  { container },
) => {
  timeline.add(() => console.info('Some nested function'));
  timeline.fromTo(container, { scale: 0 }, { scale: 1, duration: 1, ease: 'Bounce.easeOut' });
};
