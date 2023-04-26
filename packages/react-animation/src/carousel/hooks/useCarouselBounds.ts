import { useResizeObserver } from '@mediamonks/react-hooks';
import { type RefObject, useCallback, useState } from 'react';
import { useMutationObserver } from '../useMutationObserver';
import { CarouselType } from './useCarousel.js';
import { useCarouselCalculations } from './useCarouselCalculations.js';

type CarouselBoundsOptions = {
  type?: CarouselType;
};
export function useCarouselBounds(
  sliderRef: RefObject<HTMLElement>,
  { type = CarouselType.X }: CarouselBoundsOptions = {},
): Draggable.BoundsMinMax | null {
  const [bounds, setBounds] = useState<Draggable.BoundsMinMax | null>(null);
  const { getElementOffset } = useCarouselCalculations(type);

  const onResize = useCallback(() => {
    if (sliderRef.current === null) {
      // eslint-disable-next-line no-console
      console.warn("Can't set bounds, sliderRef is undefined");
      return;
    }

    const children = [...sliderRef.current.children] as unknown as ReadonlyArray<HTMLElement>;

    const firstChild = children.at(0);
    const lastChild = children.at(-1);

    if (firstChild === undefined || lastChild === undefined) {
      // eslint-disable-next-line no-console
      console.warn("Can't set bounds, sliderRef has no children");
      return;
    }

    const size = getElementOffset(lastChild) - getElementOffset(firstChild);

    setBounds(type === CarouselType.X ? { minX: -size, maxX: 0 } : { minY: -size, maxY: 0 });
  }, [sliderRef, getElementOffset, type]);

  useResizeObserver(sliderRef, onResize);
  useMutationObserver(sliderRef, onResize, {
    childList: true,
  });

  return bounds;
}
