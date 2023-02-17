/* eslint-disable react/no-multi-comp, react/jsx-no-literals */
import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresence } from './TransitionPresence.js';

export default {
  title: 'components/TransitionPresence',
};

type ChildProps = {
  background: string;
  onClick(): void;
};

// Forces a re-render, useful to test for unwanted side-effects
function useRerender(): () => void {
  // eslint-disable-next-line react/hook-use-state
  const [count, setCount] = useState(0);
  // eslint-disable-next-line no-console
  console.log('rerender', count);
  return () => {
    setCount((previous) => previous + 1);
  };
}

function Child({ background, onClick }: ChildProps): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);

  // show visible animation during "before unmount" lifecycle
  useBeforeUnmount(() => {
    const duration = 1000;
    ref.current?.animate([{ opacity: '0' }], {
      duration,
    });
    // Defer unmounting for 1 second
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }, []);

  // show when mounted/unmounted
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('mounted', background);

    return () => {
      // eslint-disable-next-line no-console
      console.log('unmounted', background);
    };
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

export function DeferFlow(): ReactElement {
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

export function CrossFlow(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  return (
    <>
      <TransitionPresence crossFlow>
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

export function CrossFlowRerender(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  // trigger rerender in the parent to see how it affects the TransitionPresence
  const rerender = useRerender();

  const onClickBlue = useCallback(() => {
    setIsRedVisible(true);
  }, [setIsRedVisible]);

  const onClickRed = useCallback(() => {
    setIsRedVisible(false);
  }, [setIsRedVisible]);

  return (
    <>
      <TransitionPresence crossFlow>
        {isRedVisible ? (
          <Child key="red" background="red" onClick={onClickRed} />
        ) : (
          /* remove key to trigger error log */
          <Child key="blue" background="blue" onClick={onClickBlue} />
        )}
      </TransitionPresence>

      <div style={{ marginTop: 24 }}>Click the square (isRedVisible: {String(isRedVisible)})</div>
      <button
        type="button"
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={(): void => {
          rerender();
        }}
      >
        trigger rerender
      </button>
    </>
  );
}

export function StartCompleteCallbacks(): ReactElement {
  const [isRedVisible, setIsRedVisible] = useState(true);

  return (
    <>
      <TransitionPresence
        /* eslint-disable-next-line react/jsx-no-bind,@typescript-eslint/explicit-function-return-type */
        onStart={() => {
          // eslint-disable-next-line no-console
          console.log('start');
        }}
        /* eslint-disable-next-line react/jsx-no-bind,@typescript-eslint/explicit-function-return-type */
        onComplete={() => {
          // eslint-disable-next-line no-console
          console.log('completed');
        }}
      >
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
