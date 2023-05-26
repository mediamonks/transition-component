import { useRef, type RefObject } from 'react';

export function useAnimationRef(ref?: RefObject<symbol>): RefObject<symbol> {
  const fallbackRef = useRef(Symbol('useAnimationRef'));
  const animationRef = useRef(fallbackRef.current);

  animationRef.current = ref?.current ?? fallbackRef.current;

  return animationRef;
}
