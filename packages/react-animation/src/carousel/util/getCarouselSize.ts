import { CarouselType } from '../hooks/useCarousel.js';

/**
 * Returns the width of an element
 */
export function getCarouselSize(element: HTMLElement, type: CarouselType): number {
  const lastChild = element.lastChild as HTMLElement | undefined;

  if (lastChild === undefined) {
    // eslint-disable-next-line no-console
    console.warn("Can't get element size, element has no children");
    return 0;
  }

  if (type === CarouselType.X) {
    return lastChild.offsetLeft + lastChild.offsetWidth;
  }

  return lastChild.offsetTop + lastChild.offsetHeight;
}
