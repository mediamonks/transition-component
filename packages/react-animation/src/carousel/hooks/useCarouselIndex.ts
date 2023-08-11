import { useCallback, useState } from 'react';
import { getCarouselIndex } from '../util/getCarouselIndex.js';
import { CarouselType, type CarouselContext } from './useCarousel.js';
import { useCarouselProxyUpdate } from './useCarouselProxyUpdate.js';

export function useCarouselIndex(
  carousel: CarouselContext,
  type = CarouselType.X,
  alignment = 0.5,
): number {
  const [index, setIndex] = useState(0);

  useCarouselProxyUpdate(
    carousel,
    useCallback(() => {
      setIndex(getCarouselIndex(carousel, type, alignment));
    }, [alignment, carousel, type]),
  );

  return index;
}
