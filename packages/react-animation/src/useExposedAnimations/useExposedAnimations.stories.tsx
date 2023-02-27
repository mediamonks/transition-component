/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { arrayRef, ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useRef, type ReactElement, useCallback, useState, useEffect } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useScrollAnimation } from '../useScrollAnimation/useScrollAnimation.js';
import { useExposedAnimations } from './useExposedAnimations.js';

export default {
  title: 'hooks/useExposedAnimations',
};

// Forces a re-render, useful to test for unwanted side-effects
function useRerender(): () => void {
  // eslint-disable-next-line react/hook-use-state
  const [count, setCount] = useState(0);
  // eslint-disable-next-line no-console
  console.log('rerender', count);
  return () => {
    setCount((previous) => previous + 1);
  };
}

const ChildItem = ensuredForwardRef<HTMLDivElement, unknown>((_, ref): ReactElement => {
  const animation = useAnimation(
    () => gsap.fromTo(ref.current, { opacity: 0, duration: 2 }, { opacity: 1 }),
    [],
  );
  useExposeAnimation(animation, ref);
  return <div ref={ref}>Check the console to see the result</div>;
});

export function PassingChildRefs(): ReactElement {
  const ref = useRef<Array<HTMLDivElement | null>>([]);
  const animations = useExposedAnimations(ref);

  // eslint-disable-next-line no-console
  console.log('useExposedAnimations', animations);

  const restartAnimations = useCallback(() => {
    for (const animation of animations) {
      animation.restart();
    }
  }, [animations]);

  return (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ChildItem key={index} ref={arrayRef(ref, index)} />
      ))}
      <button
        type="button"
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={(): void => {
          restartAnimations();
        }}
      >
        Restart animations
      </button>
    </div>
  );
}

const Child = ensuredForwardRef<Array<HTMLDivElement | null>, unknown>(
  (props, ref): ReactElement => (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ChildItem key={index} ref={arrayRef(ref, index)} />
      ))}
    </>
  ),
);

export function PassingArrayRefs(): ReactElement {
  const ref = useRef<Array<HTMLDivElement | null>>([]);
  const animations = useExposedAnimations(ref);

  // eslint-disable-next-line no-console
  console.log('useExposedAnimations', animations);

  const restartAnimations = useCallback(() => {
    for (const animation of animations) {
      animation.restart();
    }
  }, [animations]);

  return (
    <div>
      <Child ref={ref} />
      <button
        type="button"
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={(): void => {
          restartAnimations();
        }}
      >
        Restart animations
      </button>
    </div>
  );
}

export function RerenderTesting(): ReactElement {
  const rerender = useRerender();
  const ref = useRef<Array<HTMLDivElement | null>>([]);
  const animations = useExposedAnimations(ref);

  // eslint-disable-next-line no-console
  console.log('useExposedAnimations', animations);

  // if there is something wrong in the useExposedAnimations, this will keep re-rendering
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('animations updated', animations);
  }, [animations]);

  // if there is something wrong in the useExposedAnimations, this will cause a new animation
  // to trigger, which will cause 'animations' to update, which will cause a re-render, etc
  useScrollAnimation(() => gsap.timeline(), [animations]);

  return (
    <div>
      <p>
        If this is working as intended, there shouldn&apos;t be an endless streams of logs in the
        console
      </p>
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ChildItem key={index} ref={arrayRef(ref, index)} />
      ))}
      <button
        type="button"
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={(): void => {
          rerender();
        }}
      >
        Trigger rerender
      </button>
    </div>
  );
}
