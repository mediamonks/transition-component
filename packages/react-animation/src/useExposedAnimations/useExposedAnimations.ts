import { unref, type Unreffable } from '@mediamonks/react-hooks';
import { useEffect, useState } from 'react';
import { animations } from '../animations.js';

/**
 * Hook to get animation from global animations map using given reference
 */
export function useExposedAnimations(
  target: Unreffable<ReadonlyArray<unknown>>,
): ReadonlyArray<gsap.core.Animation> {
  const [exposedAnimations, setExposedAnimations] = useState<ReadonlyArray<gsap.core.Animation>>(
    [],
  );

  useEffect(
    () =>
      animations.listen(() => {
        const array = unref(target);

        if (array) {
          const newAnimations = array.map((ref) => animations.get(ref));
          // this should only be done when the refs have been updated, otherwise we're returning
          // a new array ref with the same values, which will cause a re-render
          setExposedAnimations((currentAnimations) =>
            areArraysEqual(newAnimations, currentAnimations) ? currentAnimations : newAnimations,
          );
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target],
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
