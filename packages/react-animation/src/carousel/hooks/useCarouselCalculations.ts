import { useMemo } from 'react';
import { CarouselType } from './useCarousel.js';

export const enum SizeType {
  Offset = 'offset',
  Client = 'client',
}

export function getCarouselCalculations(type: CarouselType): {
  getElementOffset<T extends HTMLElement>(element: T): number;
  getElementSize<T extends HTMLElement>(element: T, sizeType?: SizeType): number;
} {
  return {
    getElementOffset<T extends HTMLElement>(element: T): number {
      if (type === CarouselType.X) {
        return element.offsetLeft;
      }
      return element.offsetTop;
    },

    getElementSize<T extends HTMLElement>(element: T, sizeType = SizeType.Offset): number {
      if (type === CarouselType.X) {
        return element[`${sizeType}Width`];
      }
      return element[`${sizeType}Height`];
    },
  };
}

/**
 * Carousels can go in either the `x` or `y` direction and in order to keep the carousel code as clean as possible we
 * have this proxy method that returns the correct values based on the type of the carousel.
 *
 * @param type
 */
export function useCarouselCalculations(
  type: CarouselType,
): ReturnType<typeof getCarouselCalculations> {
  return useMemo(() => getCarouselCalculations(type), [type]);
}
