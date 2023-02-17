import * as React from 'react';
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
  type Key,
} from 'react';
import {
  useBeforeUnmount,
  type BeforeUnmountCallback,
} from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresenceContext } from './TransitionPresence.context.js';

export type TransitionPresenceProps = {
  children: ReactElement | null;
  crossFlow?: boolean;
  onStart?(): void;
  onComplete?(): void;
};

/**
 * Will transition out old children before replacing new children. When
 * crossFlow is enabled new children are added immediately when deferred
 * children are not the same.
 */
export function TransitionPresence({
  children,
  crossFlow,
  onStart,
  onComplete,
}: TransitionPresenceProps): ReactElement {
  const beforeUnmountCallbacks = useMemo(() => new Set<BeforeUnmountCallback>(), []);
  const [deferredChildren, setDeferredChildren] = useState<ReactElement | null>(children);

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

  useEffect(() => {
    if (areChildrenEqual(children, deferredChildren)) {
      setDeferredChildren(children);
      return;
    }
    const abortController = new AbortController();

    (async (): Promise<void> => {
      onStart?.();
      // Defer children update for before unmount lifecycle
      await beforeUnmount(abortController.signal);

      setDeferredChildren(children);
      onComplete?.();
    })();

    return () => {
      abortController.abort();
    };
  }, [children, onStart, onComplete, beforeUnmount, beforeUnmountCallbacks]);

  // Apply same effect when TransitionPresence in tree updates
  useBeforeUnmount(beforeUnmount, []);

  // Validate that children is only 1 valid React element
  if (children !== null) {
    Children.only(children);
  }

  const shouldRenderOldChildren = crossFlow && !areChildrenEqual(children, deferredChildren, true);

  return (
    <TransitionPresenceContext.Provider value={beforeUnmountCallbacks}>
      {deferredChildren}
      {shouldRenderOldChildren && children}
    </TransitionPresenceContext.Provider>
  );
}

function areChildrenEqual(
  childrenA: ReactElement | null,
  childrenB: ReactElement | null,
  showError = false,
): boolean {
  if (childrenA === childrenB) {
    return true;
  }

  const keyA = getKey(childrenA, showError);
  const keyB = getKey(childrenB, showError);

  if (!keyA && !keyB) {
    return false;
  }

  return keyA === keyB;
}

function getKey(children: ReactElement | null, showError = false): Key | undefined {
  const key = children?.key ?? undefined;

  if (showError && !key) {
    // eslint-disable-next-line no-console
    console.error('TransitionPresence: Child must have a "key" defined', children);
  }

  return key;
}
