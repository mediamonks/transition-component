import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimation } from './useExposedAnimation.js';

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

      const animation = useAnimation(
        () =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          gsap.gsap.to({ value: 0 }, { value: 1 }),
        [],
      );

      useExposeAnimation(animation, ref);

      return useExposedAnimation(ref);
    });

    expect(hook.result.current).toBeUndefined();
  });
});
