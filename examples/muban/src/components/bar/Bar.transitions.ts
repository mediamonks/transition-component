import type { BindProps } from '@muban/muban/lib/bindings/bindings.types';
import type { ElementRef } from '@muban/muban/lib/refs/refDefinitions.types';

type TransitionRefs = {
  container: ElementRef<HTMLElement, BindProps>;
  title: ElementRef<HTMLElement, BindProps>;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  { container }: TransitionRefs,
): void {
  if (container.element == null) {
    return;
  }

  timeline.fromTo(
    container.element,
    {
      scale: 0,
    },
    {
      scale: 1,
      duration: 1,
      ease: 'Bounce.easeOut',
    },
  );
}
