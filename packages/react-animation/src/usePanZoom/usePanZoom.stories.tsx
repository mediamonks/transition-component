/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-literals */
import { type StoryObj } from '@storybook/react';
import { useCallback, useRef } from 'react';
import { usePanZoom } from './usePanZoom.js';

export default {
  title: 'hooks/usePanZoom',
};

export const Demo = {
  render() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);

    const { zoomTo } = usePanZoom(containerRef, { element: elementRef });

    const onZoom = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const { x, y } = event.currentTarget.getBoundingClientRect();
        if (zoomTo) {
          zoomTo(x, y, 10);
        }
      },
      [zoomTo],
    );
    return (
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: 800,
          height: 800,
          overflow: 'hidden',
          background: 'blue',
        }}
      >
        <div
          ref={elementRef}
          style={{
            width: 800,
            height: 800,
            background: 'red',
            transition: 'scale 0.3s ease-in-out',
          }}
        >
          <img
            alt="map"
            src="https://scholar.harvard.edu/sites/scholar.harvard.edu/files/styles/os_files_xxlarge/public/ccwilcox/files/bw_globe_map.png"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
          <button
            type="button"
            onClick={onZoom}
            style={{
              position: 'absolute',
              top: '20%',
              left: '70%',
            }}
          >
            Zoom
          </button>
        </div>
      </div>
    );
  },
} as StoryObj;
