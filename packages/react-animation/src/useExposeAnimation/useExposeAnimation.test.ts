import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { getAnimation, useExposeAnimation, useExposedAnimation } from './useExposeAnimation.js';

describe('useExposeAnimation', () => {
  it('should not crash', () => {
    const hook = renderHook(() => {
      const ref = useRef(Symbol('reference'));

      useExposeAnimation(useRef(), ref);

      return {
        ref,
      };
    });

    expect(getAnimation(hook.result.current.ref.current)).toBeUndefined();
  });

  it('should return animation when animation is exposed for reference', () => {
    const hook = renderHook(() => {
      const ref = useRef(Symbol('reference'));
      const animation = useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []);

      useExposeAnimation(animation, ref);

      return {
        ref,
        animation,
      };
    });

    expect(getAnimation(hook.result.current.ref.current)).not.toBeUndefined();
  });

  it('should return undefined when unmounted', () => {
    const hook = renderHook(() => {
      const ref = useRef(Symbol('reference'));
      const animation = useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []);

      useExposeAnimation(animation, ref);

      return {
        ref,
        animation,
      };
    });

    hook.unmount();

    expect(getAnimation(hook.result.current.ref.current)).toBeUndefined();
  });
});

describe('useExposedAnimation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return undefined', () => {
    const hook = renderHook(() => {
      const ref = useRef(Symbol('reference'));

      return useExposedAnimation(ref);
    });

    expect(hook.result.current).toBeUndefined();
  });

  it('should not return undefined', async () => {
    const hook = renderHook(() => {
      const ref = useRef(Symbol('reference'));

      const animation = useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []);
      useExposeAnimation(animation, ref);

      return useExposedAnimation(ref);
    });

    expect(hook.result.current).toBeUndefined();
  });
});
