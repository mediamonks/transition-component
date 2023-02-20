import { jest } from '@jest/globals';
import { arrayRef } from '@mediamonks/react-hooks';
import { renderHook, waitFor } from '@testing-library/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimations } from './useExposedAnimations.js';

describe('useExposedAnimation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return an empty array', () => {
    const hook = renderHook(() => {
      const ref = useRef([]);

      return useExposedAnimations(ref);
    });

    hook.rerender();
    expect(hook.result.current).toEqual([]);
  });

  it('should not return undefined', async () => {
    const parentHook = renderHook(() => {
      // used in place of html elements that are normally used as ref values
      const symbol0 = Symbol('ref0');
      const symbol1 = Symbol('ref1');

      // ref array in the parent that is used in the loop to collect the ref values of the children
      const ref = useRef<Array<symbol>>([]);
      // this happens in the loop, the refFn is passed to children
      // normally there is a ensuredForwardRef HoC in between, that we manually do below
      const refFn0 = arrayRef(ref, 0);
      const refFn1 = arrayRef(ref, 1);

      return { symbol0, symbol1, ref, refFn0, refFn1 };
    });

    const hook = renderHook((ref) => useExposedAnimations(ref), {
      initialProps: parentHook.result.current.ref,
    });

    // child 0
    renderHook(
      ({ symbol, refFn }) => {
        // assigning the ref values to the ref objects
        const ref = useRef<symbol>(symbol);
        // doing what the ensuredForwardRef HoC does, by passing the ref value to the arrayRef callback function
        refFn(symbol);

        const animation0 = useAnimation(
          () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            gsap.gsap.to({ value: 0 }, { value: 1 }),
          [],
        );

        useExposeAnimation(animation0, ref);
      },
      {
        initialProps: {
          symbol: parentHook.result.current.symbol0,
          refFn: parentHook.result.current.refFn0,
        },
      },
    );

    // child 1
    renderHook(
      ({ symbol, refFn }) => {
        // assigning the ref values to the ref objects
        const ref = useRef<symbol>(symbol);
        // doing what the ensuredForwardRef HoC does, by passing the ref value to the arrayRef callback function
        refFn(symbol);

        const animation0 = useAnimation(
          () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            gsap.gsap.to({ value: 0 }, { value: 1 }),
          [],
        );

        useExposeAnimation(animation0, ref);
      },
      {
        initialProps: {
          symbol: parentHook.result.current.symbol1,
          refFn: parentHook.result.current.refFn1,
        },
      },
    );

    // makes sure the queueMicrotask in the animations can run and trigger the listeners
    await waitFor(() => {
      expect(hook.result.current).toHaveLength(2);
      expect(typeof hook.result.current[0]).toBe('object');
      expect(hook.result.current[0]).toMatchObject({ vars: { delay: 0 } });
    });
  });
});
