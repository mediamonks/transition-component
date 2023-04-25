import { useRef, type RefObject } from 'react';

export function useAnimationRef(ref?: RefObject<symbol>): RefObject<symbol> {
  const animationRef = useRef(Symbol('useAnimationRef'));

  if (ref?.current) {
    animationRef.current = ref.current;
  }

  return animationRef;
}
