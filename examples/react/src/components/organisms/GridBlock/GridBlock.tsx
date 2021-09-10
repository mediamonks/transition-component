import { useEnterTimeline } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { StyledBlock, StyledGridBlock } from './GridBlock.styles';

gsap.registerPlugin(ScrollTrigger);

interface GridBlockProps {
  backgroundColor?: string;
}

export default function GridBlock({ backgroundColor, ...props }: GridBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  useEnterTimeline(
    (timeline) => {
      timeline
        .fromTo(
          divRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 1,
          },
        )
        .fromTo(
          divRef.current!.children,
          {
            scale: 0,
          },
          {
            scale: 1,
            duration: 0.5,
            ease: 'power2.inOut',
            clearProps: 'all',
            stagger: {
              grid: [10, 6],
              from: 'center',
              amount: 1.5,
            },
          },
          0.25,
        );

      return timeline;
    },
    () => ({
      scrollTrigger: {
        scrub: 1,
        trigger: divRef.current,
        start: '-=400',
        end: '+=400',
        toggleActions: 'restart none none reset',
      },
    }),
  );

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
