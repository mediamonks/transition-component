import { ensuredForwardRef, useEventListener, useStaticValue } from '@mediamonks/react-hooks';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import gsap from 'gsap';
import { useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimation } from './useExposedAnimation.js';

const meta = {
  title: 'hooks/useExposedAnimation',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type ChildProps = {
  rotateAnimationReference?: symbol;
  scaleAnimationReference?: symbol;
};

const Child = ensuredForwardRef<HTMLDivElement, ChildProps>(
  (
    { rotateAnimationReference: rotateAnimationRef, scaleAnimationReference: scaleAnimationRef },
    ref,
  ): ReactElement => {
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
      () =>
        gsap
          .timeline({ paused: true })
          .to(ref.current, {
            x: 20,
            y: 20,
            duration: 0.4,
            ease: 'power2.inOut',
          })
          .to(ref.current, {
            x: -20,
            y: -20,
            duration: 0.4,
            ease: 'power2.out',
          })
          .to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          }),
      [],
    );

    const scaleAnimation = useAnimation(
      () =>
        gsap
          .timeline({ paused: true })
          .fromTo(ref.current, { scale: 1 }, { scale: 0.75, ease: 'power2.out' })
          .to(ref.current, { scale: 1, ease: 'power2.out' }),
      [],
    );

    useExposeAnimation(animation, ref);
    useExposeAnimation(rotateAnimation, rotateAnimationRef);
    useExposeAnimation(scaleAnimation, scaleAnimationRef);

    return (
      <div
        ref={ref}
        style={{
          inlineSize: 200,
          blockSize: 200,
          background: `linear-gradient(to bottom right, red, blue)`,
        }}
      />
    );
  },
);

export const UseExposedAnimation: Story = {
  render(): ReactElement {
    const ref = useRef<HTMLDivElement | null>(null);
    const animation = useExposedAnimation(ref);

    // eslint-disable-next-line no-console
    console.log('useExposedAnimation', animation);

    return <Child ref={ref} />;
  },
};

export const MultipleChildComponentAnimations = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story: StoryFn): ReactElement => (
      <div style={{ padding: 20 }}>
        <Story />
      </div>
    ),
  ],
  render(): ReactElement {
    const ref = useRef<HTMLDivElement | null>(null);

    const rotateAnimationReference = useStaticValue(() => Symbol('rotateAnimation'));
    const scaleAnimationReference = useStaticValue(() => Symbol('scaleAnimation'));

    const rotateAnimation = useExposedAnimation(rotateAnimationReference);
    const scaleAnimation = useExposedAnimation(scaleAnimationReference);

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
          rotateAnimationReference={rotateAnimationReference}
          scaleAnimationReference={scaleAnimationReference}
        />
        <p style={{ marginBlockStart: 40, marginBlockEnd: 0 }}>
          Press `z` to wiggle, press `x` to scale
        </p>
      </>
    );
  },
};

export const OptionalMultipleChildComponentAnimations: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story: StoryFn): ReactElement => (
      <div style={{ padding: 20 }}>
        <Story />
      </div>
    ),
  ],
  render(): ReactElement {
    const ref = useRef<HTMLDivElement | null>(null);
    const rotateAnimationReference = useStaticValue(() => Symbol('rotateAnimation'));
    const rotateAnimation = useExposedAnimation(rotateAnimationReference);

    useEventListener(globalThis.document, 'keydown', (event) => {
      if (event instanceof KeyboardEvent) {
        switch (event.key) {
          case 'z': {
            rotateAnimation?.play(0);
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
        <Child ref={ref} rotateAnimationReference={rotateAnimationReference} />
        <p style={{ marginBlockStart: 40, marginBlockEnd: 0 }}>
          Press `z` to wiggle, the scale animation is not enabled
        </p>
      </>
    );
  },
};
