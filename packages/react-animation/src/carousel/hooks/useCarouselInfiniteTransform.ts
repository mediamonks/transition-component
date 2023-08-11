import { useResizeObserver } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useCallback, useMemo, useRef, type RefObject } from 'react';
import { CarouselType, type CarouselTransform } from './useCarousel.js';
import { useCarouselCalculations } from './useCarouselCalculations.js';

type CarouselInfiniteTransformOptions = {
  type?: CarouselType;
};

export function useCarouselInfiniteTransform(
  triggerRef: RefObject<HTMLElement>,
  offsetElement: RefObject<HTMLElement> = triggerRef,
  { type = CarouselType.X }: CarouselInfiniteTransformOptions = {},
): CarouselTransform {
  const offsetRef = useRef(0);

  const { getElementSize, getElementOffset } = useCarouselCalculations(type);

  const onResize = useCallback(() => {
    const { [type]: value } = offsetElement.current?.getBoundingClientRect() ?? {};
    offsetRef.current = value ?? 0;
  }, [offsetElement, type]);

  useResizeObserver(offsetElement, onResize);

  return useMemo<CarouselTransform>(
    () =>
      (value, element): number => {
        if (triggerRef.current === null) {
          // eslint-disable-next-line no-console
          console.warn("Can't transform position, carouselRef is undefined");
          return value;
        }

        const lastChild = triggerRef.current.lastChild as HTMLElement | undefined;

        if (lastChild === undefined) {
          // eslint-disable-next-line no-console
          console.warn("Can't transform position, triggerRef.current has no children");
          return value;
        }

        const size = getElementOffset(lastChild) + getElementSize(lastChild);
        const offset = getElementOffset(element) + getElementSize(element) + offsetRef.current;

        return -gsap.utils.wrap(offset, -size + offset, -value);
      },
    [triggerRef, getElementSize, getElementOffset],
  );
}
