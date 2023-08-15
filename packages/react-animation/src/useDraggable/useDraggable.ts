import { useIsMounted, useMount, useRefValue, useUnmount } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import InertiaPlugin from 'gsap/InertiaPlugin';
import { useRef, type MutableRefObject, type RefObject } from 'react';

/**
 * When running on a node environment the `window` is not available. Registering the Draggable
 * plugin will throw errors, therefore we create this little proxy method to import draggable
 * dynamically,
 */
export const getDraggable = async (): Promise<typeof Draggable | undefined> => {
  if (typeof window === 'undefined') {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { Draggable } = await import('gsap/Draggable');

  gsap.registerPlugin(Draggable, InertiaPlugin);

  return Draggable;
};

/**
 * Omitting all callback properties, use event listener instead.
 *
 * @example
 * useEventListener(draggable, 'drag', (event) => {
 *   console.log(event);
 * })
 */
export type DraggableVariables = Draggable.Vars;

export type UseDraggableOptions = {
  variables?: DraggableVariables;
  trigger?: MutableRefObject<HTMLElement | null> | null;
  onMount?(draggable: Draggable): void;
};

export const useDraggable = (
  target: MutableRefObject<HTMLElement | null>,
  { trigger, variables, onMount }: UseDraggableOptions,
): RefObject<(Draggable & EventTarget) | null> => {
  const draggableRef = useRef<Draggable | null>(null);

  const onMountRef = useRefValue(onMount);

  const isMounted = useIsMounted();

  const createDraggable = async (): Promise<typeof Draggable | undefined> => {
    const draggable = await getDraggable();

    if (!isMounted.current || draggable === undefined || target.current === null) {
      return;
    }
    [draggableRef.current = null] = draggable.create(target.current, {
      ...variables,
      trigger: trigger?.current,
    });
    onMountRef.current?.(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      draggableRef.current!,
    );
  };

  useMount(() => {
    createDraggable();
  });

  useUnmount(() => {
    draggableRef.current?.kill();
  });

  return draggableRef as RefObject<Draggable & EventTarget>;
};