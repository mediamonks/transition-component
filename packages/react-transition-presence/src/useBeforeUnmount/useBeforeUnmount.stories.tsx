import { useState, type ReactElement } from 'react';
import { TransitionPresence } from '../TransitionPresence/TransitionPresence.js';
import { useBeforeUnmount } from './useBeforeUnmount.js';

export default {
  title: 'hooks/useBeforeUnmount',
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

export function UseBeforeUnmount(): ReactElement {
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
