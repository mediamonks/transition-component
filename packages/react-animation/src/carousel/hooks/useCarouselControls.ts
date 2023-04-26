import { useRefValue } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useMemo } from 'react';
import { CarouselType, type CarouselContext } from './useCarousel.js';
import { useCarouselCalculations } from './useCarouselCalculations.js';
import { useCarouselIndex } from './useCarouselIndex.js';

export type CarouselControls = {
  next(): Promise<void>;
  previous(): Promise<void>;
  index(index: number): Promise<void>;
};

export type UseCarouselControlsOptions = {
  alignment?: number;
  type?: CarouselType;
  snap(value: number): number;
};

export const defaultTweenVariables = {
  duration: 0.8,
  ease: 'power3.out',
} satisfies gsap.TweenVars;

export function useCarouselControls(
  carousel: CarouselContext,
  options: UseCarouselControlsOptions,
  tweenVariables: gsap.TweenVars = {},
): CarouselControls {
  const { alignment = 0, type = CarouselType.X, snap } = options;

  const _tweenVariables = useMemo(
    () => ({ ...defaultTweenVariables, ...tweenVariables }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(tweenVariables),
  );

  const { getElementSize, getElementOffset } = useCarouselCalculations(type);

  const index = useCarouselIndex(carousel, options.type, options.alignment);
  const indexRef = useRefValue(index);

  return useMemo<CarouselControls>(() => {
    function updatePosition<T extends keyof CarouselControls>(control?: T): CarouselControls[T] {
      return async (targetIndex?: number) => {
        if (indexRef.current === null || indexRef.current === -1) {
          throw new Error("Can't update position, index is undefined");
        }

        const { triggerRef, proxyRef, update } = carousel;

        const children = [
          ...(triggerRef.current?.children ?? []),
        ] as unknown as ReadonlyArray<HTMLElement>;

        const currentChild = children.at(indexRef.current);

        if (currentChild === undefined) {
          throw new Error(`Can't update position, triggerRef has no children`);
        }

        let position = gsap.getProperty(proxyRef.current, type) as number;

        switch (control) {
          case 'next': {
            position -= getElementSize(currentChild);
            break;
          }

          case 'previous': {
            position += getElementSize(currentChild);
            break;
          }

          default: {
            if (targetIndex === undefined) {
              throw new Error("Can't update position, index is undefined");
            }

            const child = children.at(targetIndex);

            if (child === undefined) {
              throw new Error(`Can't find child for index ${targetIndex}`);
            }

            // prettier-ignore
            position = -(getElementOffset(child) + (getElementSize(child) * alignment))
            break;
          }
        }

        position = snap(position);

        await gsap.to(proxyRef.current, {
          ..._tweenVariables,
          [type]: position,
          onUpdate() {
            update?.();
          },
        });
      };
    }

    return {
      next: updatePosition('next'),
      previous: updatePosition('previous'),
      index: updatePosition(),
    };
  }, [
    _tweenVariables,
    alignment,
    carousel,
    getElementOffset,
    getElementSize,
    indexRef,
    snap,
    type,
  ]);
}
