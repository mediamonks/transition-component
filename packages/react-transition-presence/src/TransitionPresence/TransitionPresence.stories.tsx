/* eslint-disable  no-console */
import { useAnimation } from '@mediamonks/react-animation';
import { type Meta } from '@storybook/react';
import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState, type ReactElement, Fragment } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresence } from './TransitionPresence.js';

const meta = {
  title: 'components/TransitionPresence',
} satisfies Meta;

export default meta;

type ChildProps = {
  background: string;
  onClick?(): void;
};

function Child({ background, onClick }: ChildProps): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);

  useAnimation(() => {
    // eslint-disable-next-line no-console
    console.log('animate-in', background);
    return gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
    );
  }, []);

  // show visible animation during "before unmount" lifecycle
  useBeforeUnmount(async (abortSignal) => {
    // eslint-disable-next-line no-console
    console.log('animate-out', background);

    const animation = gsap.fromTo(
      ref.current,
      { opacity: 1 },
      { opacity: 0, ease: 'power3.out', duration: 0.6 },
    );

    abortSignal.addEventListener('abort', () => {
      animation.pause(0);
    });

    return animation;
  });

  // show when mounted/unmounted
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('mounted', background);

    return () => {
      // eslint-disable-next-line no-console
      console.log('unmounted', background);
    };
  }, [background]);

  return (
    <button
      ref={ref}
      aria-label="Click to change color"
      type="button"
      style={{
        background: `linear-gradient(to bottom right, ${background} 0%, purple 100%)`,
        border: 'none',
        width: 200,
        height: 200,
      }}
      onClick={onClick}
    />
  );
}

export const Demo = {
  render(): ReactElement {
    const [isRedVisible, setIsRedVisible] = useState(true);

    return (
      <>
        <TransitionPresence>
          {isRedVisible ? (
            <Child
              key="red"
              background="red"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(false);
              }}
            />
          ) : (
            <Child
              key="blue"
              background="blue"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(true);
              }}
            />
          )}
        </TransitionPresence>

        <div style={{ marginTop: 24 }}>Click the square (isRedVisible: {String(isRedVisible)})</div>
      </>
    );
  },
};

export const DemoUsingFragment = {
  render(): ReactElement {
    const [isRedVisible, setIsRedVisible] = useState(true);

    return (
      <>
        <TransitionPresence>
          {isRedVisible ? (
            <Fragment key="red">
              <Child
                background="red"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={(): void => {
                  setIsRedVisible(false);
                }}
              />
              <Child background="yellow" />
            </Fragment>
          ) : (
            <Fragment key="blue">
              <Child background="yellow" />
              <Child
                background="blue"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={(): void => {
                  setIsRedVisible(true);
                }}
              />
            </Fragment>
          )}
        </TransitionPresence>

        <div style={{ marginTop: 24 }}>
          Click the blue/red square (isRedVisible: {String(isRedVisible)})
        </div>
      </>
    );
  },
};

export const DemoWithLifecycleCallbacks = {
  render(): ReactElement {
    const [isRedVisible, setIsRedVisible] = useState(true);

    const onPreviousChildrenUnmounting = useCallback(() => {
      // eslint-disable-next-line no-console
      console.log('onPreviousChildrenUnmounting');
    }, []);

    const onPreviousChildrenUnmounted = useCallback(() => {
      // eslint-disable-next-line no-console
      console.log('onPreviousChildrenUnmounted');
    }, []);

    const onChildrenMounted = useCallback(() => {
      // eslint-disable-next-line no-console
      console.log('onChildrenMounted');
    }, []);

    return (
      <>
        <TransitionPresence
          onPreviousChildrenUnmounting={onPreviousChildrenUnmounting}
          onPreviousChildrenUnmounted={onPreviousChildrenUnmounted}
          onChildrenMounted={onChildrenMounted}
        >
          {isRedVisible ? (
            <Child
              key="red"
              background="red"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(false);
              }}
            />
          ) : (
            <Child
              key="blue"
              background="blue"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(true);
              }}
            />
          )}
        </TransitionPresence>
        <div style={{ marginTop: 24 }}>Click the square (isRedVisible: {String(isRedVisible)})</div>
      </>
    );
  },
};

export const DemoClickToHide = {
  render(): ReactElement {
    const [isVisible, setIsVisible] = useState(true);

    return (
      <>
        <TransitionPresence>
          {isVisible ? (
            <Child
              key="red"
              background="red"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsVisible(false);
              }}
            />
          ) : null}
        </TransitionPresence>
        <div style={{ marginTop: 24 }}>Click the square (isVisible: {String(isVisible)})</div>
      </>
    );
  },
};
