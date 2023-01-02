import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation<T extends gsap.core.Animation>(
  callback: () => T | undefined,
  dependencies: ReadonlyArray<unknown>,
): T | undefined {
  const animation = useAnimation(callback, dependencies);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [animation]);

  return animation;
}
