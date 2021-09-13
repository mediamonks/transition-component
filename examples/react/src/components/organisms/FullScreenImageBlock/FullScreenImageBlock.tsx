import { useTimeline } from '@mediamonks/react-transition-component';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import { StyledFullScreenImageBlock } from './FullScreenImageBlock.styles';

export default function FullScreenImageBlock(): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useTimeline(
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
        markers: Boolean(process.env.SHOW_MARKERS),
        id: 'fullScreenImageBlock',
        trigger: divRef.current,
        toggleActions: 'restart none none reset',
      },
    }),
  );

  return (
    <StyledFullScreenImageBlock className="full-screen-image-block" ref={divRef}>
      <img
        alt="random nature"
        src="https://source.unsplash.com/1600x900/?nature,water"
        ref={imageRef}
      />
    </StyledFullScreenImageBlock>
  );
}
