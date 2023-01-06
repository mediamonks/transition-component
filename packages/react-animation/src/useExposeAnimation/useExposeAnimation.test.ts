import { renderHook } from '@testing-library/react';
import { gsap } from 'gsap';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { getAnimation, useExposeAnimation, useExposedAnimation } from './useExposeAnimation.js';

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

describe('useExposedAnimation', () => {
  it('should return undefined', () => {
    const ref = Symbol('reference');

    const hook = renderHook(() => useExposedAnimation(ref));

    expect(hook.result.current).toBeUndefined();
  });

  it('should return updated animation', () => {
    const ref = Symbol('reference');

    const parent = renderHook(() => useExposedAnimation(ref));

    // Child
    const child = renderHook<gsap.core.Animation | undefined, { value: number }>(
      ({ value }) => {
        const timeline = useAnimation(() => gsap.to({ value: 0 }, { value }), [value]);

        useExposeAnimation(timeline, ref);

        return timeline;
      },
      {
        initialProps: {
          value: 1,
        },
      },
    );

    const firstTimeline = child.result.current;

    expect(parent.result.current).toEqual(firstTimeline);

    child.rerender({ value: 2 });
    parent.rerender();

    expect(parent.result.current).not.toEqual(firstTimeline);
  });
});
