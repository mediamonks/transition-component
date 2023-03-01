/* eslint-disable react/no-multi-comp, react/jsx-no-literals,no-console,react/jsx-no-bind */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAnimation } from '@mediamonks/react-animation';
import gsap from 'gsap';
import {
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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

function Child({
  background,
  onClick,
  duration = 1,
  delayIn = 0,
  children,
}: PropsWithChildren<ChildProps>): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);

  const debugLog = useCallback(
    (message: string): void => {
      console.log(`%c${message}: ${background}`, `color: ${background}`);
    },
    [background],
  );

  useAnimation(() => {
    debugLog(` >> animate-in`);
    return gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration, delay: delayIn });
  }, []);

  // show visible animation during "before unmount" lifecycle
  useBeforeUnmount(async () => {
    debugLog(` << animate-out`);
    return gsap.fromTo(ref.current, { opacity: 1 }, { opacity: 0, duration });
  }, []);

  // show when mounted/unmounted
  useEffect(() => {
    debugLog('-> mounted');

    return () => {
      debugLog('<- unmounted');
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
    >
      {children}
    </button>
  );
}

export function DeferFlow(): ReactElement {
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
      <button
        type="button"
        /* eslint-disable-next-line react/jsx-no-bind */
        onClick={(): void => {
          setIsRedVisible((previous) => !previous);
        }}
      >
        Or click here to switch
      </button>
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

/**
 * Test to make sure that when a parent rerenders during a crossFlow transition,
 * the new child is not unmounted or transitioned out.
 */
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

/**
 * Test with crossflow and normal flow where items are moved between indexes.
 * It should not unmount new children during the transition.
 */
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
          <div key={index}>
            <TransitionPresence crossFlow={index <= 1}>
              <Child
                /* eslint-disable-next-line react/no-array-index-key */
                key={item + index}
                background={item}
                onClick={onNextItem}
                duration={2}
                delayIn={0}
              />
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

/**
 * Test case to make sure that children of the components passed to TransitionPresence
 * are still rerendered when the parent rerenders, and the TransitionPresence doesn't
 * block the rerender.
 */
export function RerenderChildrenIssue(): ReactElement {
  const rerender = useRerender();
  const [slideIndex, setSlideIndex] = useState(0);
  const [childIndex, setChildIndex] = useState(0);

  return (
    <div>
      <p>
        Changing the children should increase the count, even though the slide isn&apos;t updating
      </p>
      <div>
        <TransitionPresence>
          <Child
            /* eslint-disable-next-line react/no-array-index-key */
            key={slideIndex}
            background="red"
          >
            <span>{childIndex}</span>
          </Child>
        </TransitionPresence>
      </div>
      <button
        type="button"
        onClick={(): void => {
          setSlideIndex((previous) => previous + 1);
        }}
      >
        Change Slide
      </button>
      <button
        type="button"
        onClick={(): void => {
          setChildIndex((previous) => previous + 1);
        }}
      >
        Change Slide Children
      </button>
      <button
        type="button"
        onClick={(): void => {
          rerender();
        }}
      >
        Rerender
      </button>
    </div>
  );
}
