import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { unwrapRefs } from '../lib/unwrapRefs';
import { useScrollTransition } from './useScrollTransition';
import { useTransitionController } from './useTransitionController';

describe('useScrollTransition', () => {
  it('Should setup in timeline for when using useScrollTransition', async () => {
    function Component() {
      const divRef = useRef<HTMLDivElement>(null);

      const transitionController = useTransitionController(() => ({
        refs: {
          divRef,
        },
        timelineVars() {
          return {
            trigger: divRef.current,
          };
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
        expect(transitionController.getTimeline('in')).toBeUndefined();
      }, []);

      useScrollTransition(transitionController);

      useLayoutEffect(() => {
        expect(transitionController.getTimeline('in')).toBeDefined();
      }, []);

      return <div ref={divRef}>Component</div>;
    }

    const { container } = render(<Component />);

    // Wait for end of call stack stack before checking styles
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check if initial styles are set
    expect(container.firstChild).toHaveStyle('opacity: 0;');
  });
});
