import { useEnterTimeline } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { SplitText } from '../../../util/SplitText';
import { StyledHeading, StyledHeadingBlock } from './HeadingBlock.styles';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface HeadingBlockProps {
  backgroundColor?: string;
  copy?: string;
  className?: string;
}

export default function HeadingBlock({
  copy,
  className,
  backgroundColor,
  ...props
}: HeadingBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEnterTimeline(
    (timeline) => {
      const splitHeading = new SplitText(headingRef.current);

      timeline
        .fromTo(
          divRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        )
        .from(
          splitHeading.chars,
          {
            yPercent: 100,
            stagger: {
              each: 0.02,
              ease: 'power1.out',
            },
            duration: 0.25,
            ease: 'back',
          },
          0,
        )
        .from(
          splitHeading.words,
          {
            opacity: 0,
            stagger: {
              each: 0.02,
              ease: 'power1.out',
            },
            duration: 0.22,
          },
          0,
        );

      return timeline;
    },
    () => ({
      scrollTrigger: {
        scrub: false,
        trigger: divRef.current as Element,
        start: '-=300',
        end: '+=200',
      },
    }),
  );

  return (
    <StyledHeadingBlock
      className={className}
      ref={divRef}
      $backgroundColor={backgroundColor}
      {...props}
    >
      <StyledHeading ref={headingRef}>{copy}</StyledHeading>
    </StyledHeadingBlock>
  );
}
