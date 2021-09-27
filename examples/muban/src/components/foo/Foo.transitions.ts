import { findTransitionController } from '@mediamonks/muban-transition-component';
import type { BindProps } from '@muban/muban/lib/bindings/bindings.types';
import type { ComponentRef, ElementRef } from '@muban/muban/lib/refs/refDefinitions.types';
import type gsap from 'gsap';

type FooRefs = {
  container: ElementRef<HTMLElement, BindProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bar: ComponentRef<any>;
};

export function setupTransitionInTimeline(
  timeline: gsap.core.Timeline,
  { container, bar }: FooRefs,
): void {
  if (container.element == null) {
    return;
  }

  timeline
    .set(container.element, { scale: 1 })
    .fromTo(
      container.element,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4, ease: 'linear.easeNone' },
    )
    .fromTo(container.element, { y: 300 }, { y: 0, duration: 1, ease: 'Expo.easeOut' }, '<');

  const barTransitionController = findTransitionController(bar.component?.element);

  if (barTransitionController) {
    timeline.add(barTransitionController.getTimeline('in'));
  }
}

export function setupTransitionOutTimeline(
  timeline: gsap.core.Timeline,
  { container }: FooRefs,
): void {
  if (container.element == null) {
    return;
  }

  timeline
    .to(container.element, { scale: 1.5, duration: 0.4, ease: 'expo.easeOut' })
    .to(container.element, { autoAlpha: 0, duration: 0.4 }, '<');
}
