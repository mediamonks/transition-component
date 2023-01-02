import { renderHook } from '@testing-library/react';
import { gsap } from 'gsap';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { getAnimation, useExposeAnimation } from './useExposeAnimation.js';

describe('useExposeAnimation', () => {
  it('should not crash', () => {
    const ref = Symbol('reference');

    renderHook(() => {
      useExposeAnimation(undefined, ref);
    });

    expect(getAnimation(ref)).toBeUndefined();
  });

  it('should return animation when animation is exposed for reference', () => {
    const ref = Symbol('reference');

    renderHook(() => {
      const timeline = useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []);

      useExposeAnimation(timeline, ref);
    });

    expect(getAnimation(ref)).not.toBeUndefined();
  });

  it('should return undefined when animation is cleared', () => {
    const ref = Symbol('reference');

    renderHook(() => {
      const timeline = useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []);

      useExposeAnimation(timeline, ref);
    });

    renderHook(() => {
      useExposeAnimation(undefined, ref);
    });

    expect(getAnimation(ref)).not.toBeUndefined();
  });
});
