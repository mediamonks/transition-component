import { ensuredForwardRef } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import {
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  type RefAttributes,
} from 'react';
import { renderToString } from 'react-dom/server';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

/**
 * Allowed as prop values
 */
type KnownTarget = Exclude<keyof JSX.IntrinsicElements, symbol | object>;

type SplitTextWrapperProps<T extends KnownTarget> = {
  /**
   * The SplitText variables
   * @link https://greensock.com/docs/v3/Plugins/SplitText
   */
  variables?: SplitText.Vars;

  /**
   * The element type to render, the default is `div`
   */
  as?: T;

  /**
   * Split the first element child instead of the element itself to
   * accommodate for rich text children
   */
  splitFirstElementChild?: boolean;
};

/**
 * Polymorphic component type, necessary to get all the attributes/props for the
 * as prop component
 */
type SplitTextWrapperComponent = <T extends KnownTarget = 'div'>(
  props: SplitTextWrapperProps<T> &
    Omit<ComponentProps<T>, keyof SplitTextWrapperProps<T> | 'ref'> &
    RefAttributes<SplitText | null>,
) => ReactElement;

// @ts-expect-error polymorphic type is not compatible with ensuredForwardRef function factory
export const SplitTextWrapper: SplitTextWrapperComponent = ensuredForwardRef(
  ({ variables = {}, as, children, splitFirstElementChild = false, ...props }, ref) => {
    /**
     * Not using useCallback on purpose so that a new SplitText instance is
     * created whenever this component rerenders the children
     */
    const onRef = async (element: HTMLDivElement): Promise<void> => {
      if (ref.current && 'isSplit' in ref.current && ref.current.isSplit) {
        return;
      }

      if (splitFirstElementChild && element.childElementCount > 1) {
        // eslint-disable-next-line no-console
        console.warn(
          "Split text wrapper should only contain 1 element when 'splitFirstElementChild' is set to true",
        );
      }

      ref.current = new SplitText(
        splitFirstElementChild ? element.firstElementChild : element,
        variables,
      );
    };

    const Component = (as ?? 'div') as unknown as ComponentType<unknown>;

    return (
      <Component
        {...props}
        dangerouslySetInnerHTML={
          props.dangerouslySetInnerHTML ?? {
            // eslint-disable-next-line @typescript-eslint/naming-convention, react/jsx-no-useless-fragment
            __html: renderToString(<>{children}</>),
          }
        }
        // eslint-disable-next-line react/jsx-no-bind
        ref={onRef}
      />
    );
  },
);
