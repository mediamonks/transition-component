import { useRefValue } from '@mediamonks/react-hooks';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactFragment,
  type RefObject,
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
  onPreviousChildrenUnmounting?(
    previousChildren: ReactElement | ReactFragment | null,
    children: ReactElement | ReactFragment | null,
  ): void | Promise<void>;
  onPreviousChildrenUnmounted?(
    previousChildren: ReactElement | ReactFragment | null,
    children: ReactElement | ReactFragment | null,
  ): void | Promise<void>;
  onChildrenMounted?(children: ReactElement | ReactFragment | null): void | Promise<void>;
};

/**
 * Will defer transition in new children by waiting on the
 * `BeforeUnmountCallback`s that are registered using the `useBeforeUnmount`
 * hook.
 */
export function TransitionPresence({
  children,
  onPreviousChildrenUnmounting,
  onPreviousChildrenUnmounted,
  onChildrenMounted,
}: TransitionPresenceProps): ReactElement {
  const beforeUnmountCallbacks = useMemo(() => new Set<RefObject<BeforeUnmountCallback>>(), []);
  const [previousChildren, setPreviousChildren] = useState<typeof children>(children);

  const onPreviousChildrenUnmountingRef = useRefValue(onPreviousChildrenUnmounting);
  const onPreviousChildrenUnmountedRef = useRefValue(onPreviousChildrenUnmounted);
  const onChildrenMountedRef = useRefValue(onChildrenMounted);

  const beforeUnmountPreviousChildren = useCallback(
    async (abortSignal: AbortSignal) => {
      const promises: Array<ReturnType<BeforeUnmountCallback>> = [];

      for (const callback of beforeUnmountCallbacks) {
        promises.push(callback.current?.(abortSignal));
      }

      await Promise.all(promises);
    },
    [beforeUnmountCallbacks],
  );

  useEffect(() => {
    if (childrenAreEqual(children, previousChildren)) {
      return;
    }

    const abortController = new AbortController();

    (async (): Promise<void> => {
      onPreviousChildrenUnmountingRef.current?.(previousChildren, children);

      // Defer children update for before unmount lifecycle
      await beforeUnmountPreviousChildren(abortController.signal);

      setPreviousChildren(null);

      // Wait a tick after removing previous children to make sure new children
      // are re-initialized
      await tick();

      onPreviousChildrenUnmountedRef.current?.(previousChildren, children);

      // Set new children
      setPreviousChildren(children);
      await tick();

      onChildrenMountedRef.current?.(children);
    })();

    return () => {
      abortController.abort();
    };
  }, [
    beforeUnmountCallbacks,
    beforeUnmountPreviousChildren,
    children,
    onChildrenMountedRef,
    onPreviousChildrenUnmountedRef,
    onPreviousChildrenUnmountingRef,
    previousChildren,
  ]);

  // Apply same effect when TransitionPresence in tree updates
  useBeforeUnmount(beforeUnmountPreviousChildren);

  return (
    <TransitionPresenceContext.Provider value={beforeUnmountCallbacks}>
      {previousChildren}
    </TransitionPresenceContext.Provider>
  );
}
