import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useLayoutEffect, useRef } from 'react';
import { unwrapRefs } from '../lib/unwrapRefs';
import { useTransitionController } from './useTransitionController';

describe('useTransitionController', () => {
  it('Should apply initial state when setupTimeline is called', async () => {
    function Component() {
      const divRef = useRef<HTMLDivElement>(null);

      const transitionController = useTransitionController(() => ({
        refs: {
          divRef,
        },
        setupTransitionInTimeline(timeline, refs) {
          const { divRef: div } = unwrapRefs(refs);

          timeline.fromTo(
            div,
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          );
        },
      }));

      useLayoutEffect(() => {
        transitionController.setupTimeline({
          direction: 'in',
        });
      }, []);

      return <div ref={divRef}>Component</div>;
    }

    const { container } = render(<Component />);

    // Wait for end of call stack stack before checking styles
    await new Promise((r) => setTimeout(r, 0));

    // Check if initial styles are set
    expect(container.firstChild).toHaveStyle('opacity: 0;');
  });
});
