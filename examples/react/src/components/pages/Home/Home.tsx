import {
  useEnterTransition,
  useRouteLeaveTransition,
  useTransitionController,
  TransitionController,
} from '@mediamonks/react-transition-component';
import { ReactElement, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import { StyledHome } from './Home.styles';
import { setupTransitionInTimeline } from './Home.transitions';

export default function Home(): ReactElement {
  const [headingTransitionController, setHeadingTransitionController] =
    useState<TransitionController>();

  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const transitionController = useTransitionController(
    () => ({
      timelineVars: {
        scrollTrigger: {
          trigger: headingRef.current,
        },
      },
      refs: {
        div: divRef,
        heading: headingRef,
        headingTransitionController,
      },
      setupTransitionInTimeline,
    }),
    [headingTransitionController],
  );

  useEnterTransition(transitionController);
  useRouteLeaveTransition(transitionController);

  return (
    <StyledHome ref={divRef}>
      <Heading
        ref={headingRef}
        transitionController={setHeadingTransitionController}
        className="home-heading"
      >
        Home
      </Heading>
    </StyledHome>
  );
}
