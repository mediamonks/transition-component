/* eslint-disable react/no-multi-comp, react/jsx-no-literals */
import { type ReactElement, useState } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresence } from './TransitionPresence.js';

export default {
  title: 'components/TransitionPresence',
};

type ChildProps = {
  background: string;
  onClick(): void;
};

function Child({ background, onClick }: ChildProps): ReactElement {
  useBeforeUnmount(
    () =>
      // Defer unmounting for 1 second
      new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }),
    [],
  );

  return (
    <button
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
