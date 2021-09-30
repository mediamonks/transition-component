import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useLeaveTransition } from '../hooks/useLeaveTransition';
import { useTransitionController } from '../hooks/useTransitionController';
import { unwrapRefs } from '../lib/unwrapRefs';
import { TransitionPresence } from './TransitionPresence';

interface TransitionComponentProps {
  children: ReactNode;
}

function TransitionComponent({ children }: TransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const transitionController = useTransitionController(() => ({
    refs: {
      divRef,
    },
    setupTransitionOutTimeline(timeline, refs) {
      const { divRef: divElement } = unwrapRefs(refs);

      timeline.fromTo(
        divElement,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
      );
    },
  }));

  useLeaveTransition(transitionController);

  return <div ref={divRef}>{children}</div>;
}

describe('<TransitionPresence />', () => {
  it('Should render children on first render', () => {
    const { container } = render(
      <TransitionPresence>
        <TransitionComponent>Component 1</TransitionComponent>
      </TransitionPresence>,
    );

    expect(container.firstChild).toHaveTextContent('Component 1');
  });

  it('Should render new children after leave transition on rerender', async () => {
    const { container, rerender } = render(
      <TransitionPresence>
        <TransitionComponent>Component 1</TransitionComponent>
      </TransitionPresence>,
    );

    expect(container).toHaveTextContent('Component 1');

    rerender(
      <TransitionPresence>
        <TransitionComponent>Component 2</TransitionComponent>
      </TransitionPresence>,
    );

    await waitFor(() => {
      expect(container).not.toHaveTextContent('Component 1');
    });

    expect(container).toHaveTextContent('Component 2');
  });

  it('Should render children on first render with crossFlow', () => {
    const { container } = render(
      <TransitionPresence crossFlow>
        <TransitionComponent>Component 1</TransitionComponent>
      </TransitionPresence>,
    );

    expect(container.firstChild).toHaveTextContent('Component 1');
  });

  it('Should render new children immediately on rerender with crossFlow', () => {
    const { container, rerender } = render(
      <TransitionPresence crossFlow>
        <TransitionComponent>Component 1</TransitionComponent>
      </TransitionPresence>,
    );

    expect(container).toHaveTextContent('Component 1');

    rerender(
      <TransitionPresence crossFlow>
        <TransitionComponent>Component 2</TransitionComponent>
      </TransitionPresence>,
    );

    // Should have both children now
    expect(container).toHaveTextContent('Component 1');
    expect(container).toHaveTextContent('Component 2');
  });
});
