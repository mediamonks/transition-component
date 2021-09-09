import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';

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
        })
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
    <div
      ref={divRef}
      style={{
        width: 200,
        height: 200,
        background: 'red',
        margin: 20,
      }}
    >
      <Heading ref={headingRef}>About</Heading>
    </div>
  );
}
