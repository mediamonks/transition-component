import { ensuredForwardRef, useEventListener } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useRef, type ReactElement, type RefObject } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useAnimationRef } from '../useAnimationRef/useAnimationRef.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimation } from './useExposedAnimation.js';

export default {
  title: 'hooks/useExposedAnimation',
};

type ChildProps = {
  rotateAnimationRef?: RefObject<symbol>;
  scaleAnimationRef?: RefObject<symbol>;
};

const Child = ensuredForwardRef<HTMLDivElement, ChildProps>(
  ({ rotateAnimationRef, scaleAnimationRef }, ref): ReactElement => {
    const animation = useAnimation(
      () =>
        gsap.from(
          { value: 0 },
          {
            value: 1,
            // eslint-disable-next-line no-console
            onUpdate: console.log,
          },
        ),
      [],
    );

    const rotateAnimation = useAnimation(
      () => gsap.timeline({ paused: true }).fromTo(ref.current, { rotate: 0 }, { rotate: 360 }),
      [],
    );

    const scaleAnimation = useAnimation(
      () =>
        gsap
          .timeline({ paused: true })
          .fromTo(ref.current, { scale: 1 }, { scale: 0.5 })
          .to(ref.current, { scale: 1 }),
      [],
    );

    useExposeAnimation(animation, ref);
    useExposeAnimation(rotateAnimation, useAnimationRef(rotateAnimationRef));
    useExposeAnimation(scaleAnimation, useAnimationRef(scaleAnimationRef));

    return (
      <div ref={ref} style={{ inlineSize: 'fit-content' }}>
        Check the console to see the result
      </div>
    );
  },
);

export const UseExposedAnimation = {
  render(): ReactElement {
    const ref = useRef<HTMLDivElement | null>(null);
    const animation = useExposedAnimation(ref);

    // eslint-disable-next-line no-console
    console.log('useExposedAnimation', animation);

    return <Child ref={ref} />;
  },
};

export const MultipleChildComponentAnimations = {
  render(): ReactElement {
    const ref = useRef<HTMLDivElement | null>(null);

    const rotateAnimationRef = useAnimationRef();
    const rotateAnimation = useExposedAnimation(rotateAnimationRef);

    const scaleAnimationRef = useAnimationRef();
    const scaleAnimation = useExposedAnimation(scaleAnimationRef);

    useEventListener(globalThis.document, 'keydown', (event) => {
      if (event instanceof KeyboardEvent) {
        switch (event.key) {
          case 'z': {
            rotateAnimation?.play(0);
            break;
          }
          case 'x': {
            scaleAnimation?.play(0);
            break;
          }
          default: {
            break;
          }
        }
      }
    });

    const animation = useExposedAnimation(ref);

    // eslint-disable-next-line no-console
    console.log('useExposedAnimation', animation);

    return (
      <>
        <Child
          ref={ref}
          rotateAnimationRef={rotateAnimationRef}
          scaleAnimationRef={scaleAnimationRef}
        />
        <p>Press `z` to rotate, press `x` to scale</p>
      </>
    );
  },
};
