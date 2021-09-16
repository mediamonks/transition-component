import { useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { StyledBlock, StyledGridBlock } from './GridBlock.styles';
import { setupTransitionInTimeline } from './GridBlock.transitions';

gsap.registerPlugin(ScrollTrigger);

interface GridBlockProps {
  backgroundColor?: string;
}

export default function GridBlock({ backgroundColor, ...props }: GridBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  useTransitionController(() => ({
    timelineVars: {
      scrollTrigger: {
        scrub: 1,
        trigger: divRef.current,
        markers: Boolean(process.env.SHOW_MARKERS),
        id: 'gridblock',
      },
    },
    refs: {
      div: divRef,
    },
    setupTransitionInTimeline,
  }));

  return (
    <StyledGridBlock ref={divRef} $backgroundColor={backgroundColor} {...props}>
      {Array.from(new Array(120)).map((none, index) => (
        <StyledBlock
          key={index}
          $backgroundColor={backgroundColor}
          className={index === 119 ? 'last-grid-block' : ''}
        />
      ))}
    </StyledGridBlock>
  );
}
