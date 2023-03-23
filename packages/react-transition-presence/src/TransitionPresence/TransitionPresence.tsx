import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactFragment,
} from 'react';
import { childrenAreEqual } from '../_utils/childrenAreEqual.js';
import { tick } from '../_utils/tick.js';
import {
  useBeforeUnmount,
  type BeforeUnmountCallback,
} from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresenceContext } from './TransitionPresence.context.js';

export type TransitionPresenceProps = {
  children: ReactElement | ReactFragment | null;
  onTransitionComplete?(children: ReactElement | ReactFragment): void | Promise<void>;
};

/**
 * Will transition out old children before replacing new children. When
 * crossFlow is enabled new children are added immediately when deferred
 * children are not the same.
 */
export function TransitionPresence({
  children,
  onTransitionComplete,
}: TransitionPresenceProps): ReactElement {
  const beforeUnmountCallbacks = useMemo(() => new Set<BeforeUnmountCallback>(), []);
  const [previousChildren, setPreviousChildren] = useState<typeof children>(children);

  const beforeUnmount = useCallback(
    async (abortSignal: AbortSignal) => {
      const promises: Array<ReturnType<BeforeUnmountCallback>> = [];

      for (const callback of beforeUnmountCallbacks) {
        promises.push(callback(abortSignal));
      }

      await Promise.all(promises);
    },
    [beforeUnmountCallbacks],
  );

  const onTransitionCompleteRef = useRef(onTransitionComplete);
  onTransitionCompleteRef.current = onTransitionComplete;

  useEffect(() => {
    if (childrenAreEqual(children, previousChildren)) {
      return;
    }

    const abortController = new AbortController();

    (async (): Promise<void> => {
      // Defer children update for before unmount lifecycle
      await beforeUnmount(abortController.signal);

      onTransitionCompleteRef.current?.(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        previousChildren!,
      );

      // Remove old children to make sure new children are re-initialized
      setPreviousChildren(null);
      await tick();

      // Set new children
      setPreviousChildren(children);
      await tick();
    })();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeUnmount, beforeUnmountCallbacks, children]);

  // Apply same effect when TransitionPresence in tree updates
  useBeforeUnmount(beforeUnmount, []);

  return (
    <TransitionPresenceContext.Provider value={beforeUnmountCallbacks}>
      {previousChildren}
    </TransitionPresenceContext.Provider>
  );
}
