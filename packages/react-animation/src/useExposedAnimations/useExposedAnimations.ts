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
          const newAnimations = arrayRef.current.map((ref) => animations.get(ref));
          // this should only be done when the refs have been updated, otherwise we're returning
          // a new array ref with the same values, which will cause a re-render
          setExposedAnimations((currentAnimations) =>
            areArraysEqual(newAnimations, currentAnimations) ? currentAnimations : newAnimations,
          );
        }
      }),
    [arrayRef],
  );

  return exposedAnimations;
}

function areArraysEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (const [index, element] of a.entries()) {
    if (element !== b[index]) {
      return false;
    }
  }

  return true;
}
