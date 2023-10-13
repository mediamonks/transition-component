import { unref, type Unreffable } from '@mediamonks/react-hooks';
import { useEffect, type RefObject } from 'react';
import { animations } from '../animations.js';

/**
 * Hook to store animation using a reference in global animations map
 */
export function useExposeAnimation(
  animation: RefObject<gsap.core.Animation | undefined>,
  reference: Unreffable<unknown>,
): void {
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const _reference = unref(reference);
    // eslint-disable-next-line no-underscore-dangle
    const _animation = animation.current;

    if (_animation && _reference) {
      animations.set(_reference, _animation);
    }

    return () => {
      animations.delete(_reference);
    };

    // TODO: We currently rely on the Component where this hook is used,
    //  and we know that animation will get a new ref.current assigned
    //  as part of useAnimation, if that has dependencies.
    //  If that updates (due to a re-render), we should also update
    //  the animation in the global map.
    //  This feels a bit flaky, but I can't think of a better way to do this currently.
    //  We should probably have these hooks more integrated with each other.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, animation.current, reference]);
}
