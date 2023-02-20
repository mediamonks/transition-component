/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { arrayRef, ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useRef, type ReactElement, useCallback } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimations } from './useExposedAnimations.js';

export default {
  title: 'hooks/useExposedAnimations',
};

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
