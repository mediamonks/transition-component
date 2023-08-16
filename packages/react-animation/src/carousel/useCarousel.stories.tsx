/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-literals */
import { type StoryObj } from '@storybook/react';
import { useCallback, useRef, useState } from 'react';
import {
  useCarouselSnap,
  useCarouselBounds,
  useCarouselInfiniteTransform,
  getCarouselSlideProgress,
} from '../index.js';
import { CarouselType, useCarousel } from './hooks/useCarousel.js';
import { useCarouselControls } from './hooks/useCarouselControls.js';
import { useCarouselIndex } from './hooks/useCarouselIndex.js';
import { useCarouselProxyUpdate } from './hooks/useCarouselProxyUpdate.js';

export default {
  title: 'hooks/useCarousel',
};

const Amount = 6;
/* eslint-disable unicorn/new-for-builtins */
const Elements: Array<number> = [...Array(8).keys()];

export const Default = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);
    useCarousel({
      triggerRef,
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          whiteSpace: 'nowrap',
          width: '100%',
          height: '100px',
        }}
      >
        {Elements.map((index) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: '500px',
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const Snap = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const bounds = useCarouselBounds(triggerRef);
    const snap = useCarouselSnap(triggerRef);

    useCarousel({
      triggerRef,
      variables: {
        bounds,
        snap,
      },
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          whiteSpace: 'nowrap',
          width: '100%',
          height: '100px',
        }}
      >
        {Elements.map((index) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: '500px',
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const ProgressAndControl = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const bounds = useCarouselBounds(triggerRef);
    const snap = useCarouselSnap(triggerRef);

    const carousel = useCarousel({
      triggerRef,
      variables: {
        bounds,
        snap,
      },
    });

    const activeIndex = useCarouselIndex(carousel);
    const controls = useCarouselControls(carousel, { snap });

    const onNext = useCallback(() => {
      controls.next();
    }, [controls]);

    const onPrevious = useCallback(() => {
      controls.previous();
    }, [controls]);

    return (
      <div>
        <button onClick={onNext} type="button">
          Next
        </button>
        <button onClick={onPrevious} type="button">
          Previous
        </button>
        <ul
          ref={triggerRef}
          style={{
            position: 'relative',
            listStyle: 'none',
            display: 'flex',
            whiteSpace: 'nowrap',
            width: '100%',
            height: '100px',
          }}
        >
          {Elements.map((index) => (
            <li
              key={`${Amount}_${index}`}
              style={{
                display: 'inline-block',
                flexShrink: 0,
                width: '500px',
                background: 'red',
                border: '1px solid black',
              }}
            ></li>
          ))}
        </ul>
        <span>{activeIndex}</span>
      </div>
    );
  },
} as StoryObj;

export const Infinite = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const infiniteTransform = useCarouselInfiniteTransform(triggerRef);
    useCarousel({
      triggerRef,
      transforms: [infiniteTransform],
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          padding: '0',
          width: '100%',
          height: '100px',
        }}
      >
        {Elements.map((index) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: '500px',
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const InfiniteAndSnap = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const infiniteTransform = useCarouselInfiniteTransform(triggerRef);
    const snap = useCarouselSnap(triggerRef, { infinite: true });

    useCarousel({
      triggerRef,
      variables: {
        snap,
      },
      transforms: [infiniteTransform],
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          padding: '0',
          width: '100%',
          height: '100px',
        }}
      >
        {Elements.map((index: number) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: `${100 * (index + 1)}px`,
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const InfiniteAndSnapWithSlideProgress = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);
    const [currentElements, setCurrentElements] = useState(Elements);

    const infiniteTransform = useCarouselInfiniteTransform(triggerRef);
    const snap = useCarouselSnap(triggerRef, { infinite: true });

    const carousel = useCarousel({
      triggerRef,
      variables: {
        snap,
      },
      transforms: [infiniteTransform],
    });

    useCarouselProxyUpdate(carousel, () => {
      const children = [
        ...(carousel.triggerRef.current?.children ?? []),
      ] as unknown as ReadonlyArray<HTMLElement>;

      for (const [childIndex, child] of children.entries()) {
        setCurrentElements((previous) =>
          previous.map((element, elementIndex) =>
            elementIndex === childIndex
              ? Number.parseFloat(getCarouselSlideProgress(carousel, child).toFixed(2))
              : element,
          ),
        );
      }
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          padding: '0',
          width: '100%',
          height: '100px',
        }}
      >
        {currentElements.map((value: number, index: number) => (
          <li
            // eslint-disable-next-line react/no-array-index-key
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: `${100 * (index + 1)}px`,
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index} - {value}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const Vertical = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const bounds = useCarouselBounds(triggerRef);
    const snap = useCarouselSnap(triggerRef, { type: CarouselType.Y });

    useCarousel({
      triggerRef,
      variables: {
        bounds,
        snap,
        type: CarouselType.Y,
      },
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          whiteSpace: 'nowrap',
          width: '100%',
          height: '600px',
          background: 'blue',
        }}
      >
        {Elements.map((index) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: '100px',
              height: '400px',
              background: 'red',
              border: '1px solid black',
            }}
          ></li>
        ))}
      </ul>
    );
  },
} as StoryObj;

export const VerticalInfinite = {
  render() {
    const triggerRef = useRef<HTMLUListElement | null>(null);

    const infiniteTransform = useCarouselInfiniteTransform(triggerRef, triggerRef, {
      type: CarouselType.Y,
    });

    const snap = useCarouselSnap(triggerRef, { infinite: true, type: CarouselType.Y });

    useCarousel({
      triggerRef,
      variables: {
        snap,
        type: CarouselType.Y,
      },
      transforms: [infiniteTransform],
    });

    return (
      <ul
        ref={triggerRef}
        style={{
          position: 'relative',
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          whiteSpace: 'nowrap',
          width: '100%',
          height: '600px',
          background: 'blue',
        }}
      >
        {Elements.map((index) => (
          <li
            key={`${Amount}_${index}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: '100px',
              height: '400px',
              background: 'red',
              border: '1px solid black',
            }}
          >
            {index}
          </li>
        ))}
      </ul>
    );
  },
} as StoryObj;
