import gsap from 'gsap';
import { useCallback, type RefObject } from 'react';
import { CarouselType } from './useCarousel.js';
import { useCarouselCalculations } from './useCarouselCalculations.js';

type CarouselSnapOptions = {
  /**
   * Value between 0 and 1 that determines the alignment of the snap points.
   *
   * 0 = start
   * 0.5 = center
   * 1 = end
   */
  alignment?: number;
  infinite?: boolean;
  type?: CarouselType;
};

export function useCarouselSnap(
  carouselRef: RefObject<HTMLElement | null>,
  options: CarouselSnapOptions = {},
): (value: number) => number {
  const { alignment = 0, infinite = false, type = CarouselType.X } = options;

  const { getElementOffset, getElementSize } = useCarouselCalculations(type);

  return useCallback(
    (value: number) => {
      if (carouselRef.current === null) {
        // eslint-disable-next-line no-console
        console.warn('carouselRef.current is null');
        return 0;
      }

      const lastChild = carouselRef.current.lastChild as HTMLElement | undefined;

      if (lastChild === undefined) {
        // eslint-disable-next-line no-console
        console.warn('carouselRef.current has no children');
        return 0;
      }

      const size = getElementOffset(lastChild) + getElementSize(lastChild);
      const base = value - (value % size);

      const children = [...carouselRef.current.children] as unknown as ReadonlyArray<HTMLElement>;

      let snapConfig = children.map(
        // prettier-ignore
        (child) => -(getElementOffset(child) + (getElementSize(child) * alignment)),
      );

      if (infinite) {
        snapConfig = snapConfig.flatMap((point) => [
          base - size + point,
          base + point,
          base + size + point,
        ]);
      }

      return gsap.utils.snap(snapConfig, value);
    },
    [alignment, carouselRef, getElementOffset, getElementSize, infinite],
  );
}
