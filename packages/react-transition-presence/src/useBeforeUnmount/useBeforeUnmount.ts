import { useRefValue } from '@mediamonks/react-hooks';
import { useEffect } from 'react';
import { useTransitionPresence } from '../TransitionPresence/TransitionPresence.context.js';

export type BeforeUnmountCallback = (
  abortSignal: AbortSignal,
) => // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
PromiseLike<unknown> | void;

/**
 * Executes async callback to defer unmounting of children in nearest
 * TransitionPresence boundary
 */
export function useBeforeUnmount(callback: BeforeUnmountCallback): void {
  const transitionPresence = useTransitionPresence();
  const callbackRef = useRefValue(callback);

  useEffect(() => {
    queueMicrotask(() => {
      transitionPresence?.add(callbackRef);
    });

    return () => {
      transitionPresence?.delete(callbackRef);
    };
  }, [transitionPresence, callbackRef]);
}
