/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimation } from './useExposedAnimation.js';

export default {
  title: 'hooks/useExposedAnimation',
};

const Child = ensuredForwardRef<HTMLDivElement, unknown>((_, ref): ReactElement => {
  const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);

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
