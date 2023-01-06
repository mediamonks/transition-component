import { useEffect, useState } from 'react';

class AnimationsMap extends Map {
  private readonly callbacks = new Set<() => void>();

  public set(key: unknown, value: gsap.core.Animation): this {
    const result = super.set(key, value);

    for (const callback of this.callbacks) {
      callback();
    }

    return result;
  }

  public listen(callback: () => void): () => void {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }
}

/**
 * Global map of animations that can be accessed by reference
 */
export const animations = new AnimationsMap();

/**
 * Tries to get animation from global animations map using given reference
 */
export function getAnimation(reference: unknown): gsap.core.Animation | undefined {
  return animations.get(reference);
}

/**
 * Hook to store animation using a reference in global animations map
 */
export function useExposeAnimation(
  animation: gsap.core.Animation | undefined,
  reference: unknown,
): void {
  useEffect(() => {
    if (animation) {
      animations.set(reference, animation);
    }

    return () => {
      animations.delete(reference);
    };
  }, [animation, reference]);
}

/**
 * Hook to get animation from global animations map using given reference
 */
export function useExposedAnimation(ref: unknown): gsap.core.Animation | undefined {
  const [animation, setAnimation] = useState<gsap.core.Animation | undefined>(animations.get(ref));

  useEffect(
    () =>
      animations.listen(() => {
        setAnimation(animations.get(ref));
      }),
    [ref],
  );

  return animation;
}
