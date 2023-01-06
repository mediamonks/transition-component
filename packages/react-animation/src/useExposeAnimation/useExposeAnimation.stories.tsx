/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useEffect, useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { getAnimation, useExposeAnimation, useExposedAnimation } from './useExposeAnimation.js';

export default {
  title: 'hooks/useExposeAnimation',
};

const Child = ensuredForwardRef<HTMLDivElement, unknown>((_, ref): ReactElement => {
  const animation = useAnimation(
    () =>
      gsap.from(
        {
          value: 0,
        },
        {
          value: 1,
        },
      ),
    [],
  );

  useExposeAnimation(animation, ref);

  return <div ref={ref}>Check the console to see the result</div>;
});

export function UseExposedAnimation(): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const animation = useExposedAnimation(ref);

  // eslint-disable-next-line no-console
  console.log('useExposedAnimation', animation);

  return <Child ref={ref} />;
}

export function GetAnimation(): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const a = getAnimation(ref.current);
    // eslint-disable-next-line no-console
    console.log('getAnimation', a);
  }, [ref]);

  return <Child ref={ref} />;
}
