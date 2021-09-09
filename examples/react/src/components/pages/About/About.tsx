import {
  TransitionControllerRef,
  useRouteTransitionController,
} from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import FullScreenBlock from '../../organisms/FullScreenBlock/FullScreenBlock';
import HeadingBlock from '../../organisms/HeadingBlock/HeadingBlock';
import { StyledAbout } from './About.styles';

interface AboutProps {
  transitionRef?: TransitionControllerRef;
}
export default function About({ transitionRef }: AboutProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  useRouteTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline(timeline) {
        timeline
          .set(divRef.current, {
            opacity: 0,
          })
          .to(divRef.current, {
            opacity: 1,
            duration: 1,
          });

        return timeline;
      },
      setupTransitionOutTimeline(timeline) {
        timeline.to(divRef.current, {
          opacity: 0,
          duration: 1,
        });

        return timeline;
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledAbout ref={divRef}>
      <HeadingBlock backgroundColor={'#F0F8FF'} copy={'This is the about page'} />
      <FullScreenBlock backgroundColor={'#F0FFFF'} />
      <FullScreenBlock backgroundColor={'#F5F5DC'} />
      <HeadingBlock backgroundColor={'red'} copy={'This is still the about page'} />
    </StyledAbout>
  );
}
