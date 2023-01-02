import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  useBeforeUnmount,
  type BeforeUnmountCallback,
} from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresenceContext } from './TransitionPresence.context.js';

export type TransitionPresenceProps = {
  children: ReactNode;
  crossFlow?: boolean;
};

/**
 * Will transition out old children before replacing new children. When
 * crossFlow is enabled new children are added immediately when deferred
 * children are not the same.
 */
export function TransitionPresence({ children, crossFlow }: TransitionPresenceProps): ReactElement {
  const beforeUnmountCallbacks = useMemo(() => new Set<BeforeUnmountCallback>(), []);
  const [deferredChildren, setDeferredChildren] = useState<ReactNode>(children);

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
    const abortController = new AbortController();

    (async (): Promise<void> => {
      // Defer children update for before unmount lifecycle
      await beforeUnmount(abortController.signal);

      setDeferredChildren(children);
    })();

    return () => {
      abortController.abort();
    };
  }, [children, beforeUnmount, beforeUnmountCallbacks]);

  // Apply same effect when TransitionPresence in tree updates
  useBeforeUnmount(beforeUnmount, []);

  // Validate that children is only 1 valid React element
  if (children !== null && children !== false) {
    Children.only(children);
  }

  return (
    <TransitionPresenceContext.Provider value={beforeUnmountCallbacks}>
      {deferredChildren}
      {crossFlow && (deferredChildren === children ? null : children)}
    </TransitionPresenceContext.Provider>
  );
}
