import { ensuredForwardRef } from '@mediamonks/react-hooks';
import SplitText from 'gsap/SplitText';
import { useCallback, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

export type SplitTextWrapperProps = {
  children: ReactElement;
  variables?: SplitText.Vars;
};

export const SplitTextWrapper = ensuredForwardRef<SplitText | null, SplitTextWrapperProps>(
  ({ children, variables = {} }, ref): ReactElement => {
    const onRef = useCallback(
      async (element: HTMLDivElement) => {
        if (ref.current && 'isSplit' in ref.current && ref.current.isSplit) {
          return;
        }

        ref.current = new SplitText(element, variables);
      },
      [ref, variables],
    );

    return (
      <div
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
