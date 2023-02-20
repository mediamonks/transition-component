import { useEffect, useState, type RefObject } from 'react';
import { animations } from '../animations.js';

/**
 * Hook to get animation from global animations map using given reference
 */
export function useExposedAnimations(
  arrayRef: RefObject<ReadonlyArray<unknown>>,
): ReadonlyArray<gsap.core.Animation> {
  const [exposedAnimations, setExposedAnimations] = useState<ReadonlyArray<gsap.core.Animation>>(
    [],
  );

  useEffect(
    () =>
      animations.listen(() => {
        if (arrayRef.current) {
          setExposedAnimations(arrayRef.current.map((ref) => animations.get(ref)));
        }
      }),
    [arrayRef],
  );

  return exposedAnimations;
}
