import { useEffect, useState, type RefObject } from 'react';
import { animations } from '../animations.js';

/**
 * Hook to get animation from global animations map using given reference
 */
export function useExposedAnimation<T extends gsap.core.Animation>(
  ref: RefObject<unknown>,
): T | undefined {
  const [animation, setAnimation] = useState<T | undefined>();

  useEffect(
    () =>
      animations.listen(() => {
        setAnimation(animations.get(ref.current));
      }),
    [ref],
  );

  return animation;
}
