import gsap from 'gsap';
import { type CarouselContext, type CarouselType } from '../hooks/useCarousel.js';
import { getCarouselSize } from './getCarouselSize.js';

/**
 * Returns a number between 0 and 1 representing the progress of the carousel.
 */
export function getCarouselProgress(carouselContext: CarouselContext, type: CarouselType): number {
  const { triggerRef, proxyRef } = carouselContext;

  if (triggerRef.current === null) {
    return 0;
  }

  const size = getCarouselSize(triggerRef.current, type);
  const position = gsap.getProperty(proxyRef.current, type) as number;

  return (position % size) / size;
}
