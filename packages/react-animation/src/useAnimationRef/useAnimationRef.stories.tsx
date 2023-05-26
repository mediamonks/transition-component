import { type Meta, type StoryObj } from '@storybook/react';
import gsap from 'gsap';
import { useEffect, type ReactElement, type RefObject } from 'react';
import { getAnimation } from '../index.js';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useAnimationRef } from './useAnimationRef.js';

const meta = {
  title: 'hooks/useAnimationRef',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ChildProps = {
  animationRef?: RefObject<symbol>;
};

function Child({ animationRef }: ChildProps): ReactElement {
  const animation = useAnimation(() => gsap.from({ value: 0 }, { value: 1 }), []);

  useExposeAnimation(
    animation,
    // Also use animation ref when exposing animation to deal with optional props
    useAnimationRef(animationRef),
  );

  return <div />;
}

export const UseAnimationRef = {
  render(): ReactElement {
    const animationRef = useAnimationRef();

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log('Mount\n', animationRef.current, getAnimation(animationRef.current));
    }, [animationRef]);

    // eslint-disable-next-line no-console
    console.log('Render\n', animationRef.current, getAnimation(animationRef.current));

    return (
      <>
        <div>Check the console to see the result</div>

        <Child animationRef={animationRef} />
      </>
    );
  },
} satisfies Story;
