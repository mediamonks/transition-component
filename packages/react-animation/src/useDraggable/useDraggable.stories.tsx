/* eslint-disable react-hooks/rules-of-hooks */
import { useEventListener, useRefValue, useStaticValue } from '@mediamonks/react-hooks';
import { type StoryObj } from '@storybook/react';
import { useMemo, useRef } from 'react';
import { useDraggable } from './useDraggable.js';

export const Demo = {
  render() {
    const proxyElement = useStaticValue(() =>
      typeof window === 'undefined' ? null : document.createElement('div'),
    );

    const targetRef = useRefValue(proxyElement);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    const draggable = useDraggable(targetRef, {
      trigger: triggerRef,
      variables: {},
    });

    useEventListener(draggable.current, 'drag', (event) => {
      // eslint-disable-next-line no-console
      console.log(event, gsap.getProperty(proxyElement, 'x'), gsap.getProperty(proxyElement, 'y'));
    });

    return (
      <div
        ref={triggerRef}
        style={{
          width: 200,
          height: 200,
          background: 'red',
        }}
      />
    );
  },
} as StoryObj;
