/* eslint-disable react/jsx-no-bind */
import { jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { type ReactElement } from 'react';
import { useBeforeUnmount, type BeforeUnmountCallback } from '../index.js';
import { TransitionPresence } from './TransitionPresence.js';

function Child({ beforeUnmount }: { beforeUnmount: BeforeUnmountCallback }): ReactElement {
  useBeforeUnmount(beforeUnmount, []);

  return <div data-testid="test" />;
}

describe('TransitionPresence', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should not crash/render nothing', () => {
    const result = render(<TransitionPresence>{null}</TransitionPresence>);

    expect(result.container.children.length).toBe(0);
  });

  it('should render children', async () => {
    const result = render(
      <TransitionPresence>
        <Child beforeUnmount={(): Promise<void> => Promise.resolve()} />
      </TransitionPresence>,
    );

    result.findByTestId('test');
  });

  it('should defer unmounting child with before unmount callback', async () => {
    const result = render(
      <TransitionPresence>
        <Child
          beforeUnmount={(): Promise<void> =>
            new Promise<void>((resolve) => {
              setTimeout(resolve, 1000);
            })
          }
        />
      </TransitionPresence>,
    );

    await result.findByTestId('test');

    await act(async () => {
      result.rerender(<TransitionPresence>{null}</TransitionPresence>);

      await result.findByTestId('test');
    });

    expect(result.container.children.length).toBe(0);
  });
});
