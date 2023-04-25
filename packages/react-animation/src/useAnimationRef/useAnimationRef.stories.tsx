import { type StoryObj } from '@storybook/react';
import gsap from 'gsap';
import { useEffect, type ReactElement, type RefObject } from 'react';
import { getAnimation } from '../index.js';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useAnimationRef } from './useAnimationRef.js';

export default {
  title: 'hooks/useAnimationRef',
};

export const UseAnimationRef = {
  render({ optionalRef }): ReactElement {
    const animationRef = useAnimationRef(optionalRef);

    const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);
    useExposeAnimation(animation, useAnimationRef(animationRef));

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log(animationRef.current, getAnimation(animationRef.current));
    }, [animationRef]);

    return <div>Check the console to see the result</div>;
  },
} satisfies StoryObj<{ optionalRef: RefObject<symbol> }>;
