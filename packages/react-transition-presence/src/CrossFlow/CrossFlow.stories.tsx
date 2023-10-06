/* eslint-disable react/no-multi-comp, react/jsx-no-literals,no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAnimation } from '@mediamonks/react-animation';
import type { Meta } from '@storybook/react';
import gsap from 'gsap';
import { Fragment, useEffect, useRef, useState, type ReactElement } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { CrossFlow } from './CrossFlow.js';

export default {
  title: 'components/CrossFlow',
  argTypes: {
    children: {
      description: 'ReactElement | null',
      type: 'string',
    },
    onChildrenMounted: {
      description: '() => void | undefined',
      type: 'string',
    },
  },
} satisfies Meta;

type ChildProps = {
  background: string;
  duration?: number;
  delayIn?: number;
  onClick?(): void;
};

function Child({ background, onClick, duration = 1, delayIn = 0 }: ChildProps): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);

  // show when mounted/unmounted
  useEffect(() => {
    console.log('mounted', background);

    return () => {
      console.log('unmounted', background);
    };
  }, [background]);

  useAnimation(() => {
    console.log('animate-in', background);
    return gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration, delay: delayIn });
  }, []);

  // show visible animation during "before unmount" lifecycle
  useBeforeUnmount(async (abortSignal) => {
    console.log('animate-out', background);

    const animation = gsap.fromTo(ref.current, { opacity: 1 }, { opacity: 0, duration });

    abortSignal.addEventListener('abort', () => {
      animation.pause(0);
    });

    return animation;
  });

  return (
    <button
      ref={ref}
      aria-label="Click to change color"
      type="button"
      style={{
        background,
        border: 'none',
        width: 200,
        height: 200,
      }}
      onClick={onClick}
    />
  );
}

export function CrossFlowExample(): ReactElement {
  const [hue, setHue] = useState(0);

  return (
    <>
      <CrossFlow>
        <Child
          // Changing a key will create a new component instance and thus animates out the previous child
          key={hue}
          background={`repeating-linear-gradient(
            -45deg,
            hsl(${hue}, 100%, 50%),
            hsl(${hue}, 100%, 50%) 10px,
            hsl(${(hue + 180) % 360}, 100%, 50%) 10px,
            hsl(${(hue + 180) % 360}, 100%, 50%) 20px
          )`}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(): void => {
            setHue(hue + ((90 + Math.random() * 270) % 360));
          }}
        />
      </CrossFlow>

      <div style={{ marginTop: 24 }}>Click the square to create a new element</div>
    </>
  );
}

export function CrossFlowFragmentExample(): ReactElement {
  const [hue, setHue] = useState(0);

  return (
    <>
      <CrossFlow>
        <Fragment key={hue}>
          <Child
            background={`repeating-linear-gradient(
            -45deg,
            hsl(${hue}, 100%, 50%),
            hsl(${hue}, 100%, 50%) 10px,
            hsl(${(hue + 180) % 360}, 100%, 50%) 10px,
            hsl(${(hue + 180) % 360}, 100%, 50%) 20px
          )`}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={(): void => {
              setHue(hue + ((90 + Math.random() * 270) % 360));
            }}
          />
          <Child
            background={`repeating-linear-gradient(
            -45deg,
            hsl(${hue + (90 % 360)}, 100%, 50%),
            hsl(${hue + (90 % 360)}, 100%, 50%) 10px,
            hsl(${(hue + 270) % 360}, 100%, 50%) 10px,
            hsl(${(hue + 270) % 360}, 100%, 50%) 20px
          )`}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={(): void => {
              setHue(hue + ((90 + Math.random() * 270) % 360));
            }}
          />
        </Fragment>
      </CrossFlow>

      <div style={{ marginTop: 24 }}>Click the square to create a new element</div>
    </>
  );
}
