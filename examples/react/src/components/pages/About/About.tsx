import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';
import { StyledAbout, StyledHeading } from './About.styles';
import FullScreenBlock from '../../organisms/FullScreenBlock/FullScreenBlock';

interface AboutProps {
  transitionRef?: TransitionControllerRef;
}
export default function About({ transitionRef }: AboutProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline(timeline) {
        timeline
          .set(divRef.current, {
            xPercent: 100,
          })
          .set(headingRef.current, {
            y: 30,
            opacity: 0,
          })
          .to(divRef.current, {
            xPercent: 0
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
        })
        timeline.to(divRef.current, {
          xPercent: 100,
          duration: 1,
        });

        return timeline;
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledAbout
      ref={divRef}
    >
      <StyledHeading ref={headingRef}>About</StyledHeading>
      <FullScreenBlock backgroundColor={'red'} />
      <FullScreenBlock backgroundColor={'green'} />
      <FullScreenBlock backgroundColor={'blue'} />
    </StyledAbout>
  );
}
