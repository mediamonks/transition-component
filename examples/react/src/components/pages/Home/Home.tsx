import {
  TransitionControllerRef,
  useRouteTransitionController,
} from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import { StyledHome } from './Home.styles';

interface HomeProps {
  transitionRef?: TransitionControllerRef;
}

export default function Home({ transitionRef }: HomeProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useRouteTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline(timeline) {
        timeline
          .set(divRef.current, {
            scale: 0,
          })
          .set(headingRef.current, {
            y: 30,
            opacity: 0,
          })
          .to(divRef.current, {
            rotation: 45,
            scaleY: 1,
            scaleX: 0.5,
          })
          .to(divRef.current, {
            scale: 1,
            rotation: 0,
          })
          .to(headingRef.current, {
            y: 0,
            opacity: 1,
          });

        return timeline;
      },
      setupTransitionOutTimeline(timeline) {
        timeline.to(headingRef.current, {
          opacity: 0,
          duration: 0.3,
        });
        timeline.to(divRef.current, {
          x: 0,
          scale: 1.5,
          rotation: -270,
          duration: 1,
        });

        return timeline;
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledHome ref={divRef}>
      <Heading ref={headingRef} className='home-heading'>Home</Heading>
    </StyledHome>
  );
}
