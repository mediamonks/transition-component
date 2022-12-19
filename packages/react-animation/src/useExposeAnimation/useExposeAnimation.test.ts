import { renderHook } from '@testing-library/react';
import gsap from 'gsap';
import { useAnimation } from '../useAnimation/useAnimation';
import { getAnimation, useExposeAnimation } from './useExposeAnimation';

describe('useExposeAnimation', () => {
  it('should not crash', () => {
    const ref = Symbol('reference');

    renderHook(() => {
      const timeline = useAnimation(() => gsap.timeline(), []);

      useExposeAnimation(timeline, ref);
    });

    expect(getAnimation(ref)).not.toBeUndefined();
  });
});
