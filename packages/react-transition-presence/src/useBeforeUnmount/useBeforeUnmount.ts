import { useCallback, useEffect } from 'react';
import { useTransitionPresence } from '../TransitionPresence/TransitionPresence.context.js';

export type BeforeUnmountCallback = (abortSignal: AbortSignal) => PromiseLike<unknown> | void;

/**
 * Executes async callback to defer unmounting of children in nearest
 * TransitionPresence boundary
 */
export function useBeforeUnmount(
  callback: BeforeUnmountCallback,
  dependencies: ReadonlyArray<unknown>,
): void {
  const transitionPresence = useTransitionPresence();

  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention, react-hooks/exhaustive-deps
  const _callback = useCallback(callback, dependencies);

  useEffect(() => {
    queueMicrotask(() => {
      transitionPresence?.add(_callback);
    });

    return () => {
      transitionPresence?.delete(_callback);
    };
  }, [transitionPresence, _callback]);
}
