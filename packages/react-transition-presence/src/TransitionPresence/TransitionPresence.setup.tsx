/* eslint-disable react/no-multi-comp */
import { type ReactElement } from 'react';
import { useBeforeUnmount } from '../useBeforeUnmount/useBeforeUnmount.js';
import { TransitionPresence } from './TransitionPresence.js';

type ChildProps = {
  testid?: string;
};

export function Child({ testid = 'test' }: ChildProps): ReactElement {
  useBeforeUnmount(
    () =>
      new Promise((r) => {
        setTimeout(r, 1500);
      }),
  );

  return <div data-testid={testid}>{testid}</div>;
}

export function TestTransitionPresence({ testid }: ChildProps): ReactElement {
  return (
    <TransitionPresence>
      {testid ? <Child key={testid} testid={testid} /> : null}
    </TransitionPresence>
  );
}
