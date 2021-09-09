import type { ReactElement, ReactNode } from 'react';
import React, { useRef } from 'react';
import { StyledFullScreenBlock } from './FullScreenBlock.styles';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FullScreenBlockProps {
  backgroundColor?: string;
  children?: ReactNode;
  transitionRef?: TransitionControllerRef;
}

export default function FullScreenBlock(
  {transitionRef, children, backgroundColor, ...props}:FullScreenBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

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
            toggleActions: "restart none none reset"
          }
        })
        .fromTo(divRef.current, {
          opacity: 0,
        }, {
          opacity: 1,
        });
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledFullScreenBlock
      ref={divRef}
      $backgroundColor={backgroundColor}
      {...props}
    >
      {children}
    </StyledFullScreenBlock>
  );
};
