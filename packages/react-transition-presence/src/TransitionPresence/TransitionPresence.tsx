import * as React from 'react';
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
import { useOld } from './useOld.js';

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

  const previousChildren = useOld<ReactElement | null>(children) ?? null;
  const previousDeferredChildren = useOld<ReactElement | null>(deferredChildren) ?? null;
  const childrenChangedSinceLastRender = useRef(true);

  childrenChangedSinceLastRender.current =
    !areChildrenEqual(children, previousChildren) ||
    !areChildrenEqual(deferredChildren, previousDeferredChildren);

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
    // If we have two children with the same key, we should not trigger a new transition.
    // This is set after the first transition, so that deferredChildren is in the correct state
    // when the next transition is triggered.
    if (areChildrenEqual(children, deferredChildren)) {
      // console.log('    setDeferredChildren early return');
      setDeferredChildren(children);
      return;
    }

    // When nothing has changed since the last render, we should not trigger a new transition.
    // This check is done on the keys of each. It will still render them properly, it just won't
    // trigger a transition.
    if (!childrenChangedSinceLastRender.current) {
      // The children and the deferred children are the same,
      // so we should not trigger a new transition.
      // If we do, we accidentally animate out new children.
      return;
    }

    const abortController = new AbortController();

    (async (): Promise<void> => {
      onStart?.();
      // Defer children update for before unmount lifecycle
      await beforeUnmount(abortController.signal);

      // console.log('    setDeferredChildren after unMount children');
      setDeferredChildren(children);
      // Note: even though we're calling `onComplete` here, the in animation of the new children
      // could still be running.
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

  // console.group('TransitionPresence::render');
  // console.log(
  //   `children %c${children?.key}`,
  //   `color: ${String(children?.key).replaceAll(/\d/gu, '')}`,
  // );
  // console.log(
  //   `deferredChildren %c${deferredChildren?.key}`,
  //   `color: ${String(deferredChildren?.key).replaceAll(/\d/gu, '')}`,
  // );
  // console.groupEnd();

  const shouldRenderOldChildren = crossFlow && !areChildrenEqual(children, deferredChildren, false);

  return (
    <TransitionPresenceContext.Provider value={beforeUnmountCallbacks}>
      {deferredChildren}
      {shouldRenderOldChildren && children}
    </TransitionPresenceContext.Provider>
  );
}

/**
 * Checks if two children are equal by comparing their keys.
 */
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
