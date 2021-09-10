import type { ForwardedRef, RefObject } from 'react';
import { useLayoutEffect } from 'react';

export function useSyncRef<T extends unknown>(
  ref: RefObject<T>,
  forwardRef: ForwardedRef<T>,
): void {
  useLayoutEffect(() => {
    if (forwardRef == null) {
      return;
    }

    if (typeof forwardRef === 'function') {
      forwardRef(ref.current);
      return;
    }

    if ('current' in forwardRef) {
      // eslint-disable-next-line no-param-reassign
      forwardRef.current = ref.current;
    }
  }, [forwardRef]);
}
