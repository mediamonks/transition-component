/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useEffect, useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { getAnimation } from './getAnimation.js';

export default {
  title: 'hooks/getAnimation',
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

export function GetAnimation(): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const animation = getAnimation(ref.current);
    // eslint-disable-next-line no-console
    console.log('getAnimation', animation);
  }, [ref]);

  return <Child ref={ref} />;
}
