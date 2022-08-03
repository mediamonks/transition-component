import { unwrapRefs } from '@mediamonks/muban-transition-component';
import type gsap from 'gsap';
import type { ElementRef } from '@muban/muban';

export type TransitionRefs = {
  container: ElementRef;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  refs: TransitionRefs,
): void {
  const { container } = unwrapRefs(refs);

  // eslint-disable-next-line no-console
  timeline.add(() => console.info('Some nested function'));
  timeline.fromTo(container, { scale: 0 }, { scale: 1, duration: 1, ease: 'Bounce.easeOut' });
}
