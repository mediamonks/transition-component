import { type RefObject, useCallback, useEffect, useRef } from 'react';

/**
 * Create gsap animation via a callback, animation is killed when component is
 * unmounted or when a new callback function is provided.
 */
export function useAnimation<T extends gsap.core.Animation>(
  callback: () => T | undefined,
  dependencies: ReadonlyArray<unknown>,
): RefObject<T | undefined> {
  const animation = useRef<T>();

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-underscore-dangle
  const _callback = useCallback(callback, dependencies);

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const _animation = _callback();
    animation.current = _animation;

    return () => {
      _animation?.kill();
    };
  }, [_callback]);

  return animation;
}
