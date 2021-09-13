import { useEnterTimeline, useRouteLeaveTimeline } from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import FullScreenImageBlock from '../../organisms/FullScreenImageBlock/FullScreenImageBlock';
import GridBlock from '../../organisms/GridBlock/GridBlock';
import HeadingBlock from '../../organisms/HeadingBlock/HeadingBlock';
import { StyledAbout } from './About.styles';

export default function About(): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  useEnterTimeline((timeline) => {
    timeline.fromTo(
      divRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
    );

    return timeline;
  });

  useRouteLeaveTimeline((timeline) => {
    timeline.to(divRef.current, {
      opacity: 0,
      duration: 1,
    });

    return timeline;
  });

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
