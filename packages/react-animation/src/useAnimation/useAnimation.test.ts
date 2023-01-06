import { renderHook } from '@testing-library/react';
import { gsap } from 'gsap';
import { type RefObject } from 'react';
import { useAnimation } from './useAnimation.js';

describe('useAnimation', () => {
  it('should not crash', () => {
    renderHook(() => useAnimation(() => gsap.to({ value: 0 }, { value: 1 }), []));
  });

  it('should return animation and update it when dependencies change', () => {
    const ref = { value: 0 };

    const hook = renderHook<RefObject<gsap.core.Animation | undefined>, { value: number }>(
      ({ value = 1 }) => useAnimation(() => gsap.to(ref, { value }), [value]),
      {
        initialProps: {
          value: 1,
        },
      },
    );

    hook.result.current.current?.progress(1);
    expect(ref.value).toBe(1);

    hook.rerender({ value: 2 });
    hook.result.current.current?.progress(1);
    expect(ref.value).toBe(2);
  });
});
