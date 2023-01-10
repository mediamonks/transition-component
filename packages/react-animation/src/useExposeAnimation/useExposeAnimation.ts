import { useEffect, type RefObject } from 'react';
import { animations } from '../animations.js';

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
