import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { StyledHeadingBlock, StyledHeading } from './HeadingBlock.styles';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../../../util/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface HeadingBlockProps {
  backgroundColor?: string;
  copy?: string;
  transitionRef?: TransitionControllerRef;
}

export default function HeadingBlock(
  {transitionRef, copy, backgroundColor, ...props}:HeadingBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const splitHeading = new SplitText(headingRef.current);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline( ) {
        return gsap.timeline({
          scrollTrigger: {
            scrub: 1,
            trigger: divRef.current as Element,
            start: divRef.current ? Math.max(divRef.current.offsetTop - 100, 0) : 0,
            end: "+=200",
            markers: true,
            toggleActions: "restart none none reset"
          }
        })
        .fromTo(divRef.current, {
          opacity: 0,
        }, {
          opacity: 1,
        })
        .from(splitHeading.words, {yPercent:-100,  stagger:0.05, duration:0.3, ease:"back"})
        .from(splitHeading.words, {opacity:0, stagger:0.05, duration:0.2}, 0);
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledHeadingBlock
      ref={divRef}
      $backgroundColor={backgroundColor}
      {...props}
    >
      <StyledHeading ref={headingRef}>
        {copy}
      </StyledHeading>
    </StyledHeadingBlock>
  );
};
