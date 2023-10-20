/* eslint-disable react/jsx-no-literals */
import { useEventListener, useToggle } from '@mediamonks/react-hooks';
import type { Meta, StoryObj } from '@storybook/react';
import { useRef, type CSSProperties, type ReactElement } from 'react';
import { useFlip } from './useFlip.js';

const meta = {
  title: 'hooks/useFlip',
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const flipOptions = {
  ease: 'power2.inOut',
} satisfies Flip.FromToVars;

const styles = {
  backgroundColor: 'royalblue',
} satisfies CSSProperties;

export const Default: Story = {
  render(): ReactElement {
    const [isFlipped, toggle] = useToggle(false);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);

    useFlip(div1Ref, flipOptions);
    useFlip(div2Ref, flipOptions);

    useEventListener(globalThis.document, 'click', () => {
      toggle();
    });

    return (
      <>
        <p>
          Click to rerender, the box will fill the right side of the screen using position absolute.
        </p>
        <div
          ref={div1Ref}
          style={
            isFlipped
              ? {
                  ...styles,
                  position: 'absolute',
                  insetBlock: 0,
                  insetInlineStart: '50%',
                  insetInlineEnd: 0,
                }
              : {
                  ...styles,
                  inlineSize: 150,
                  blockSize: 150,
                }
          }
        />
        <p ref={div2Ref}>The element renders inline</p>
      </>
    );
  },
};
