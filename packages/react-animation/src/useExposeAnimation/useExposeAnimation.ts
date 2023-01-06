import { useEffect, useState, type RefObject } from 'react';
import { animations } from '../animations.js';

/**
 * Tries to get animation from global animations map for given reference
 */
export function getAnimation(reference: unknown): gsap.core.Animation | undefined {
  return animations.get(reference);
}

/**
 * Hook to store animation using a reference in global animations map
 */
export function useExposeAnimation(
  animation: RefObject<gsap.core.Animation | undefined>,
  reference: RefObject<unknown>,
): void {
  useEffect(() => {
    const _reference = reference.current;
    const _animation = animation.current;

    if (_animation) {
      animations.set(_reference, _animation);
    }

    return () => {
      animations.delete(_reference);
    };
  }, [animation, reference]);
}

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
