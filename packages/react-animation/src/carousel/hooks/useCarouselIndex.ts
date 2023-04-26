import { useCallback, useState } from 'react';
import { getIndex } from './getIndex.js';
import { CarouselType, type CarouselContext } from './useCarousel.js';
import { useProxyUpdate } from './useProxyUpdate.js';

export function useCarouselIndex(
  carousel: CarouselContext,
  type = CarouselType.X,
  alignment = 0.5,
): number {
  const [index, setIndex] = useState(0);

  useProxyUpdate(
    carousel,
    useCallback(() => {
      setIndex(getIndex(carousel, type, alignment));
    }, [alignment, carousel, type]),
  );

  return index;
}
