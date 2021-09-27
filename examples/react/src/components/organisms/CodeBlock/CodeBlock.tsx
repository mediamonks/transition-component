import {
  TransitionPresence,
  useEnterTransition,
  useLeaveTransition,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import { ReactElement, useCallback, useRef, useState } from 'react';
import { StyledCodeBlock, StyledButton } from './CodeBlock.styles';

interface CodeBlockCopyButtonProps {
  value: string;
}

function CodeBlockCopyButton({ value }: CodeBlockCopyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const transitionController = useTransitionController(() => ({
    refs: {
      buttonRef,
    },
    setupTransitionInTimeline(timeline, { buttonRef }) {
      timeline.fromTo(
        buttonRef.current,
        {
          xPercent: 100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out',
        },
      );
    },
    setupTransitionOutTimeline(timeline, { buttonRef }) {
      timeline.to(buttonRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power4.out',
      });
    },
  }));

  useEnterTransition(transitionController);
  useLeaveTransition(transitionController);

  const onWriteToClipboard = useCallback(async (event) => {
    event.preventDefault();

    await navigator.clipboard.writeText(value);
  }, []);

  return (
    <StyledButton onClick={onWriteToClipboard} ref={buttonRef}>
      COPY
    </StyledButton>
  );
}

interface CodeBlockProps extends CodeBlockCopyButtonProps {
  language?: 'typescript' | 'javascript';
}

export function CodeBlock({ value, language = 'typescript' }: CodeBlockProps): ReactElement {
  const [hover, setHover] = useState(false);

  const trimmedValue = value.trim();

  return (
    <StyledCodeBlock onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <code className={`language-${language}`}>{trimmedValue}</code>

      <TransitionPresence>
        {hover && <CodeBlockCopyButton value={trimmedValue} />}
      </TransitionPresence>
    </StyledCodeBlock>
  );
}
