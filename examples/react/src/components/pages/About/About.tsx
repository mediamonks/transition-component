import {
  useEnterTransition,
  useRouteLeaveTransition,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import { useRef } from 'react';
import FullScreenImageBlock from '../../organisms/FullScreenImageBlock/FullScreenImageBlock';
import GridBlock from '../../organisms/GridBlock/GridBlock';
import HeadingBlock from '../../organisms/HeadingBlock/HeadingBlock';
import { StyledAbout } from './About.styles';
import { setupTransitionInTimeline, setupTransitionOutTimeline } from './About.transitions';

export default function About(): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  const transitionController = useTransitionController(() => ({
    refs: {
      div: divRef,
    },
    setupTransitionInTimeline,
    setupTransitionOutTimeline,
  }));

  useEnterTransition(transitionController);
  useRouteLeaveTransition(transitionController);

  return (
    <StyledAbout ref={divRef}>
      <HeadingBlock
        className="main-about-heading"
        backgroundColor="#F0F8FF"
        copy="This is the about page, this animation will only trigger once"
      />
      <GridBlock backgroundColor="#F0FFFF" />
      <FullScreenImageBlock />
    </StyledAbout>
  );
}
