import gsap from 'gsap';
import { CarouselType, type CarouselContext } from '../hooks/useCarousel.js';
import { getCarouselCalculations } from '../hooks/useCarouselCalculations.js';

export function getCarouselIndex(
  carousel: CarouselContext,
  type = CarouselType.X,
  alignment = 0.5,
): number {
  const { getElementOffset, getElementSize } = getCarouselCalculations(type);
  const { proxyRef, triggerRef } = carousel;

  const position = gsap.getProperty(proxyRef.current, type) as number;

  const children = [
    ...(triggerRef.current?.children ?? []),
  ] as unknown as ReadonlyArray<HTMLElement>;

  const firstChild = children.at(0);
  const lastChild = children.at(-1);

  if (firstChild === undefined || lastChild === undefined) {
    return -1;
  }

  const size =
    getElementOffset(lastChild) + getElementSize(lastChild) - getElementOffset(firstChild);

  return Math.max(
    0,
    children.findIndex(
      // prettier-ignore
      (child) => getElementOffset(child) + (getElementSize(child) * alignment) > ((position % size) + size) % size,
    ),
  );
}
