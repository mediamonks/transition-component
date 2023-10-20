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
 * Find deepest child as long as there is only one
 * @param parent
 * @returns
 */
function findDeepestChild(parent: Element): Element {
  let [child] = parent.children;

  while (parent.children.length === 1) {
    [child] = parent.children;
    // eslint-disable-next-line no-param-reassign
    parent = child;
  }

  return parent;
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
   * Split by selector to accommodate for the SplitText limitations when splitting lines
   * in nested elements
   */
  splitDeep?: boolean;
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
  ({ variables = {}, as, children, splitDeep = false, ...props }, ref) => {
    /**
     * Not using useCallback on purpose so that a new SplitText instance is
     * created whenever this component rerenders the children
     */
    const onRef = async (element: HTMLDivElement): Promise<void> => {
      if (ref.current && 'isSplit' in ref.current && ref.current.isSplit) {
        return;
      }

      ref.current = new SplitText(splitDeep ? findDeepestChild(element) : element, variables);
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
