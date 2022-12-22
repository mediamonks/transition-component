import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  let animations: Map<unknown, gsap.core.Animation>;
}

globalThis.animations = new Map<unknown, gsap.core.Animation>();

/**
 * Tries to get animation from global animations map using given reference
 */
export function getAnimation(
  reference: unknown,
): // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
gsap.core.Animation | undefined {
  return globalThis.animations.get(reference);
}

/**
 * Hook to store animation using a reference in global animations map
 */
export function useExposeAnimation(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  animation: gsap.core.Animation | undefined,
  reference: unknown,
): void {
  useEffect(() => {
    if (animation) {
      globalThis.animations.set(reference, animation);
    }

    return () => {
      globalThis.animations.delete(reference);
    };
  }, [animation, reference]);
}
