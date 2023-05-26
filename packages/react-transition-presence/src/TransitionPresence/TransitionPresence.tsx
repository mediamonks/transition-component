import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type Key,
  useRef,
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
  const lastRenderChildren = useRef<
    [children: ReactElement | null, deferredChildren: ReactElement | null]
  >([null, null]);
  const isReRender = useRef(false);
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

  // Check if the children or deferredChildren have changed since the previous render
  isReRender.current = ((): boolean => {
    const [previousChildren, previousDeferredChildren] = lastRenderChildren.current;
    lastRenderChildren.current = [children, deferredChildren];
    return (
      areChildrenEqual(previousChildren, children) &&
      areChildrenEqual(previousDeferredChildren, deferredChildren)
    );
  })();

  useEffect(() => {
    if (isReRender.current) {
      // The children and the deferred children are the same,
      // so we should not trigger a new transition.
      // If we do, we accidentally animate out new children.
      return;
    }
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
  }, [children, deferredChildren, onStart, onComplete, beforeUnmount, beforeUnmountCallbacks]);

  // Apply same effect when TransitionPresence in tree updates
  useBeforeUnmount(beforeUnmount, []);

  // Validate that children is only 1 valid React element
  if (children !== null) {
    Children.only(children);
  }

  const shouldRenderOldChildren = crossFlow && !areChildrenEqual(children, deferredChildren, false);

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
  showError = true,
): boolean {
  const keyA = getKey(childrenA, showError);
  const keyB = getKey(childrenB, showError);

  if (childrenA === childrenB) {
    return true;
  }

  if (!keyA && !keyB) {
    return false;
  }

  return keyA === keyB;
}

function getKey(children: ReactElement | null, showError = false): Key | undefined {
  if (!children) {
    return undefined;
  }

  const key = children.key ?? undefined;

  if (showError && !key) {
    // eslint-disable-next-line no-console
    console.error('TransitionPresence: Child must have a "key" defined', children);
  }

  return key;
}
