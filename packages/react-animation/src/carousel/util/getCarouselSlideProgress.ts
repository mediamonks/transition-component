import { type CarouselContext, CarouselType } from '../hooks/useCarousel.js';

/**
 * Returns a number between 0 and 1 representing the progress of the target slide.
 *
 * -1 represents the slide being completely off the left side of the carousel.
 * 1 represents the slide being completely off the right side of the carousel.
 * 0 represents the slide being at the left side of the carousel.
 */
export function getCarouselSlideProgress(
  carouselContext: CarouselContext,
  element: HTMLElement,
): number {
  const { triggerRef } = carouselContext;

  if (triggerRef.current === null) {
    return 0;
  }

  // eslint-disable-next-line unicorn/consistent-destructuring
  const { type } = carouselContext.draggable?.current?.vars ?? {};

  if (type === CarouselType.X) {
    const { left: triggerLeft, right: triggerRight } = triggerRef.current.getBoundingClientRect();
    const { left: targetLeft } = element.getBoundingClientRect();

    return (targetLeft - triggerLeft) / (triggerRight - triggerLeft);
  }

  const { top: triggerTop, bottom: triggerBottom } = triggerRef.current.getBoundingClientRect();
  const { top: targetTop } = element.getBoundingClientRect();

  return (targetTop - triggerTop) / (triggerBottom - triggerTop);
}
