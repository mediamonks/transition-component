import type { ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { StyledHeadingBlock, StyledHeading } from './HeadingBlock.styles';
import {
  TransitionControllerRef,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../../../util/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface HeadingBlockProps {
  backgroundColor?: string;
  copy?: string;
  className?: string;
  transitionRef?: TransitionControllerRef;
}

export default function HeadingBlock({
  transitionRef,
  copy,
  className,
  backgroundColor,
  ...props
}: HeadingBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [splitHeading, setSplitHeading] = useState<SplitText | null>(null);

  useEffect(() => {
    setSplitHeading(new SplitText(headingRef.current));
  }, []);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline() {
        return gsap
          .timeline({
            scrollTrigger: {
              scrub: false,
              trigger: divRef.current as Element,
              start: '-=300',
              end: '+=200',
              markers: true,
              toggleActions: 'restart none none reset',
            },
          })
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
            splitHeading?.chars || null,
            { yPercent: 100, stagger: 0.05, duration: 0.3, ease: 'back' },
            0,
          )
          .from(splitHeading?.words || null, { opacity: 0, stagger: 0.05, duration: 0.2 }, 0);
      },
    }),
    [divRef, transitionRef, splitHeading],
  );

  return (
    <StyledHeadingBlock className={className} ref={divRef} $backgroundColor={backgroundColor} {...props}>
      <StyledHeading ref={headingRef}>{copy}</StyledHeading>
    </StyledHeadingBlock>
  );
}
