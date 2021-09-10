import { useEnterTimeline } from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { StyledFullScreenImageBlock } from './FullScreenImageBlock.styles';

export default function FullScreenImageBlock(): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEnterTimeline(
    (timeline) => {
      timeline.fromTo(
        imageRef.current,
        {
          yPercent: -10,
          scale: 1.2,
        },
        {
          yPercent: 10,
          duration: 1,
          ease: 'power1.inOut',
        },
        0,
      );

      return timeline;
    },
    () => ({
      scrollTrigger: {
        scrub: 1,
        trigger: divRef.current as Element,
        start: divRef.current ? Math.max(divRef.current.offsetTop - window.innerHeight, 0) : 0,
        end: `+=${(divRef.current as HTMLElement).offsetHeight + window.innerHeight}`,
        toggleActions: 'restart none none reset',
      },
    }),
  );

  return (
    <StyledFullScreenImageBlock ref={divRef}>
      <img
        alt="random nature"
        src="https://source.unsplash.com/1600x900/?nature,water"
        ref={imageRef}
      />
    </StyledFullScreenImageBlock>
  );
}
