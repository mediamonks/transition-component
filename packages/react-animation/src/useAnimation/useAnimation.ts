import { useCallback, useEffect, useState } from 'react';

/**
 * Create gsap animation via a callback, animation is killed when component is
 * unmounted or when a new callback function is provided.
 */
export function useAnimation<T extends gsap.core.Animation>(
  callback: () => T | undefined,
  dependencies: ReadonlyArray<unknown>,
): T | undefined {
  const [animation, setAnimation] = useState<T | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _callback = useCallback(callback, dependencies);

  useEffect(() => {
    const _animation = _callback();

    setAnimation(_animation);

    return () => {
      _animation?.revert();
    };
  }, [_callback]);

  return animation;
}
