/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useEffect, useRef, type ReactElement } from 'react';
import { getAnimation } from '../index.js';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';

export default {
  title: 'hooks/useExposeAnimation',
};

export const UseExposeAnimation = {
  render(): ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);
    useExposeAnimation(animation, ref);

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log(getAnimation(ref.current));
    }, []);

    return <div ref={ref}>Check the console to see the result</div>;
  },
};

export const UseExposeAnimationForwardRef = {
  render(): ReactElement {
    const Component = ensuredForwardRef<HTMLDivElement, unknown>((_, ref): ReactElement => {
      const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);
      useExposeAnimation(animation, ref);

      useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(getAnimation(ref.current));
      }, [ref]);

      return <div ref={ref}>Check the console to see the result</div>;
    });

    return <Component />;
  },
};

export const UseExposeAnimationStringReference = {
  render(): ReactElement {
    const ref = useRef('myRef');

    const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);
    useExposeAnimation(animation, ref);

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log(getAnimation('myRef'));
    }, []);

    return <div>Check the console to see the result</div>;
  },
};
