/* eslint-disable react/no-multi-comp, react/jsx-no-literals,no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAnimation } from '@mediamonks/react-animation';
import gsap from 'gsap';
import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresence } from './TransitionPresence.js';

export default {
  title: 'components/TransitionPresence',
};

type ChildProps = {
  background: string;
  duration?: number;
  delayIn?: number;
  onClick?(): void;
};

// Forces a re-render, useful to test for unwanted side-effects
function useRerender(): () => void {
  // eslint-disable-next-line react/hook-use-state
  const [count, setCount] = useState(0);
  console.log('rerender', count);
  return () => {
    setCount((previous) => previous + 1);
  };
}

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
  }, []);

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

export function DeferFlowExample(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  return (
    <>
      <TransitionPresence>
        {isRedVisible ? (
          <Child
            background="red"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={(): void => {
              setIsRedVisible(false);
            }}
          />
        ) : (
          <Child
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
}

export function DeferFlowFragmentExample(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  return (
    <>
      <TransitionPresence>
        {isRedVisible ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            <Child
              background="red"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(false);
              }}
            />
            <Child background="yellow" />
          </>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            <Child background="yellow" />
            <Child
              background="blue"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(): void => {
                setIsRedVisible(true);
              }}
            />
          </>
        )}
      </TransitionPresence>

      <div style={{ marginTop: 24 }}>
        Click the blue/red square (isRedVisible: {String(isRedVisible)})
      </div>
    </>
  );
}

export function StartCompleteCallbacks(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  const onTransitionComplete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('onTransitionComplete');
  }, []);

  return (
    <>
      <TransitionPresence onTransitionComplete={onTransitionComplete}>
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
}

const initialItems = ['red', 'blue', 'green', 'yellow'];
export function RerenderUnmountIssue(): ReactElement {
  const [items, setItems] = useState(() => initialItems);
  const rerender = useRerender();

  const onReset = useCallback(() => {
    setItems(initialItems);
  }, [setItems]);
  const onNextItem = useCallback(() => {
    setItems((previous) => {
      const [first, ...rest] = previous;
      return [...rest, first];
    });
    // This would trigger out animations when
    // not properly handled in the TransitionPresence
    setTimeout(() => {
      rerender();
    }, 100);
  }, [setItems, rerender]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} style={{ width: index === 0 ? 400 : 200 }}>
            <TransitionPresence>
              <Child background={item} onClick={onNextItem} duration={2} delayIn={0} />
            </TransitionPresence>
          </div>
        ))}
      </div>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
