/* eslint-disable react/jsx-no-literals */
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import gsap from 'gsap';
import { useCallback, useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { SplitTextWrapper } from './SplitTextWrapper.js';

const meta = {
  title: 'components/SplitTextWrapper',
  component: SplitTextWrapper,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Children: Story = {
  render(): ReactElement {
    const splitTextRef = useRef<SplitText>(null);

    const animation = useAnimation(() => {
      if (!splitTextRef.current) {
        return;
      }

      return gsap.from(splitTextRef.current.lines, {
        paused: true,
        y: 20,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
      });
    }, []);

    const onPlay = useCallback(() => {
      animation.current?.play(0);
    }, [animation]);

    return (
      <>
        <SplitTextWrapper ref={splitTextRef} variables={{ type: 'lines' }} data-testid="wrapper">
          Lorem ipsum dolor sit <i>amet consectetur</i>
          <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,
          <br /> illo molestias, <code data-testid="code">quia sapiente</code> modi quo
          <br /> molestiae temporibus.
        </SplitTextWrapper>
        <button
          onClick={onPlay}
          type="button"
          style={{
            position: 'relative',
            marginBlockStart: 20,
            cursor: 'pointer',
          }}
        >
          Play
        </button>
      </>
    );
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByTestId('wrapper');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.childElementCount).toEqual(4);

    // Wait 2 ticks for styles to be initialized
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(wrapper.children[0]).toHaveStyle({ opacity: '0' });
    expect(wrapper.children[3]).toHaveStyle({ opacity: '0' });

    await userEvent.click(canvas.getByText('Play'));
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 200 + wrapper.childElementCount * 50);
    });

    expect(wrapper.children[0]).toHaveStyle({ opacity: '1' });
    expect(wrapper.children[3]).toHaveStyle({ opacity: '1' });
  },
};

export const DangerouslySetInnerHtml: Story = {
  render(): ReactElement {
    const splitTextRef = useRef<SplitText>(null);

    const animation = useAnimation(() => {
      if (!splitTextRef.current) {
        return;
      }

      return gsap.from(splitTextRef.current.lines, {
        y: 20,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
      });
    }, []);

    const onPlay = useCallback(() => {
      animation.current?.play(0);
    }, [animation]);

    return (
      <>
        <SplitTextWrapper
          ref={splitTextRef}
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __html:
              'Lorem ipsum dolor sit <i>amet consectetur</i> <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,<br /> illo molestias, <code>quia sapiente</code> modi quo<br /> molestiae temporibus.',
          }}
        />
        <button
          onClick={onPlay}
          type="button"
          style={{
            position: 'relative',
            marginBlockStart: 20,
            cursor: 'pointer',
          }}
        >
          Play
        </button>
      </>
    );
  },
};

export const DeepNestedChildren: Story = {
  render(): ReactElement {
    const splitTextRef = useRef<SplitText>(null);

    const animation = useAnimation(() => {
      if (!splitTextRef.current) {
        return;
      }

      return gsap.from(splitTextRef.current.lines, {
        y: 20,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
      });
    }, []);

    const onPlay = useCallback(() => {
      animation.current?.play(0);
    }, [animation]);

    return (
      <>
        <SplitTextWrapper
          ref={splitTextRef}
          variables={{ type: 'lines' }}
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __html:
              '<div><div><p>Lorem ipsum dolor sit <i>amet consectetur</i> <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,<br /> illo molestias, <code>quia sapiente</code> modi quo<br /> molestiae temporibus.</p></div></div>',
          }}
          splitDeep
        />
        <button
          onClick={onPlay}
          type="button"
          style={{
            position: 'relative',
            marginBlockStart: 20,
            cursor: 'pointer',
          }}
        >
          Play
        </button>
      </>
    );
  },
};

export const AsProp: Story = {
  render(): ReactElement {
    const splitText1Ref = useRef<SplitText>(null);
    const splitText2Ref = useRef<SplitText>(null);

    const animation = useAnimation(() => {
      if (!splitText1Ref.current || !splitText2Ref.current) {
        return;
      }

      return gsap
        .timeline()
        .from(splitText1Ref.current.lines, {
          y: 20,
          x: 4,
          opacity: 0,
          duration: 0.2,
          stagger: 0.1,
        })
        .from(
          splitText2Ref.current.words,
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
            ease: 'power2.out',
            stagger: {
              from: 'edges',
              amount: 0.5,
            },
          },
          0.15,
        );
    }, []);

    const onPlay = useCallback(() => {
      animation.current?.play(0);
    }, [animation]);

    return (
      <>
        <SplitTextWrapper ref={splitText1Ref} as="h1" data-testid="heading">
          I&apos;m an h1 element. <br /> <br />
          <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,
          <br /> illo molestias, <code data-testid="code">quia sapiente</code> modi quo
          <br /> molestiae temporibus.
        </SplitTextWrapper>
        <SplitTextWrapper
          ref={splitText2Ref}
          as="label"
          htmlFor="value"
          data-testid="label"
          style={{ display: 'block' }}
        >
          I&apos;m a label element. <br /> <br />
          <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,
          <br /> illo molestias, <code data-testid="code">quia sapiente</code> modi quo
          <br /> molestiae temporibus.
        </SplitTextWrapper>
        <button
          onClick={onPlay}
          type="button"
          style={{
            position: 'relative',
            marginBlockStart: 20,
            cursor: 'pointer',
          }}
        >
          Play
        </button>
      </>
    );
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    expect(canvas.getByTestId('heading').tagName).toEqual('H1');
    expect(canvas.getByTestId('label').tagName).toEqual('LABEL');
  },
};
