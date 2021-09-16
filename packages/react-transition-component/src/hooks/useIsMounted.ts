import type { RefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';

export function useIsMounted(): RefObject<boolean> {
  const isMounted = useRef(true);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  return isMounted;
}
