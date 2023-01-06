import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

gsap.registerPlugin(SplitText);

export type SplitTextWrapperProps = {
  children: ReactElement;
  variables?: SplitText.Vars;
};

export const SplitTextWrapper = ensuredForwardRef<SplitText | null, SplitTextWrapperProps>(
  ({ children, variables = {} }, ref): ReactElement => {
    /**
     * Not using useCallback on purpose so that a new SplitText instance is
     * created whenever this component rerenders the children
     */
    const onRef = async (element: HTMLDivElement): Promise<void> => {
      if (ref.current && 'isSplit' in ref.current && ref.current.isSplit) {
        return;
      }

      ref.current = new SplitText(element, variables);
    };

    return (
      <div
        // eslint-disable-next-line react/jsx-no-bind
        ref={onRef}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: renderToString(children),
        }}
      />
    );
  },
);
