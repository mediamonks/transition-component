import type { ComponentFactory, ComponentRef, ElementRef } from '@muban/muban';
import { findTransitionController, unwrapRefs } from '@mediamonks/muban-transition-component';

type TransitionRefs = {
  container: ElementRef;
  bar: ComponentRef<ComponentFactory>;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  refs: TransitionRefs,
): void {
  const { bar, container } = unwrapRefs(refs);
  const barTimeline = findTransitionController(bar)?.getTimeline('in');

  timeline.set(container, { scale: 1 });
  timeline.fromTo(
    container,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.4, ease: 'linear.easeNone' },
  );
  timeline.fromTo(container, { y: 300 }, { y: 0, duration: 1, ease: 'Expo.easeOut' }, '<');
  if (barTimeline) timeline.add(barTimeline);
}

export function setupTransitionOutTimeline(
  timeline: gsap.core.Timeline,
  refs: TransitionRefs,
): void {
  const { container } = unwrapRefs(refs);

  timeline.to(container, { scale: 1.5, duration: 0.4, ease: 'expo.easeOut' });
  timeline.to(container, { autoAlpha: 0, duration: 0.4 }, '<');
}
