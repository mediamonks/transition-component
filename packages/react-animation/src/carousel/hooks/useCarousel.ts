import { useEventListener, useRefValue, useResizeObserver } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useDraggable } from '../../useDraggable/useDraggable.js';

export type CarouselContext = {
  draggable?: RefObject<Draggable | null>;
  triggerRef: RefObject<HTMLElement | null>;
  proxyRef: RefObject<HTMLDivElement | null>;

  update?(): void;
};

export type CarouselTransform = (
  value: number,
  child: HTMLElement,
  context: CarouselContext,
) => number;

export enum CarouselType {
  X = 'x',
  Y = 'y',
}

export type CarouselOptions = {
  triggerRef: RefObject<HTMLElement>;
  variables?: Omit<Draggable.Vars, 'type'> & {
    type?: CarouselType;
  };
  transforms?: ReadonlyArray<CarouselTransform>;
};

export class ProxyUpdateEvent extends Event {
  public static type = 'proxyupdate';

  public constructor() {
    super(ProxyUpdateEvent.type);
  }
}

export function useCarousel({
  triggerRef,
  variables = {},
  transforms = [],
}: CarouselOptions): CarouselContext {
  const proxy = useMemo(
    () => (typeof window === 'undefined' ? null : document.createElement('div')),
    [],
  );

  const type = useMemo(
    () => variables.type ?? CarouselType.X,
    // type cannot change once draggable is initialized
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const transformsRef = useRefValue(transforms);
  const variablesRef = useRefValue(variables);
  const proxyRef = useRefValue(proxy);

  const contextRef = useRef<CarouselContext>({
    triggerRef,
    proxyRef,
  });

  const onDrag = useCallback(() => {
    if (proxy === null) {
      throw new Error('Cannot update carousel, proxy is null');
    }

    const position = gsap.getProperty(proxy, type) as number;

    const children = [
      ...(triggerRef.current?.children ?? []),
    ] as unknown as ReadonlyArray<HTMLElement>;

    for (const child of children) {
      let childPosition = position;

      for (const transform of transformsRef.current ?? []) {
        childPosition = transform(childPosition, child, contextRef.current);
      }

      gsap.set(child, {
        [type]: childPosition,
        force3D: true,
      });
    }

    proxy.dispatchEvent(new ProxyUpdateEvent());
  }, [proxy, type, triggerRef, transformsRef]);

  // Expose onDrag so that carousel can be updated externally
  contextRef.current.update = onDrag;

  const draggable = useDraggable(proxyRef, {
    trigger: triggerRef,
    variables: {
      ...variables,
      type,
      inertia: true,
      throwProps: true,
      zIndexBoost: false,
      edgeResistance: 1,
      minDuration: variables.minDuration ?? 1,
      maxDuration: variables.maxDuration ?? 1,
      bounds: variables.bounds,
      snap: variables.snap,
    },
    async onMount() {
      if (draggable.current === null) {
        return;
      }

      contextRef.current.draggable = draggable;

      updateBounds();
      onDrag();
    },
  });

  const updateBounds = useCallback(() => {
    if (draggable.current === null) {
      return;
    }

    draggable.current.applyBounds(variablesRef.current?.bounds ?? null);
  }, [draggable, variablesRef]);

  const onResize = useRafCallback(() => {
    let position = gsap.getProperty(proxyRef.current, type) as number;

    if (typeof variables.snap === 'function') {
      position = variables.snap(position);
    }

    gsap.set(proxyRef.current, { [type]: position });
    onDrag();
  }, []);

  // Apply bounds when they change and update the position
  useEffect(() => {
    updateBounds();
    onDrag();
  }, [draggable, onDrag, updateBounds, variables.bounds]);

  useEventListener(draggable, 'drag', () => {
    variablesRef.current?.onDrag?.();
    onDrag();
  });

  useEventListener(draggable, 'throwupdate', () => {
    variablesRef.current?.onThrowUpdate?.();
    onDrag();
  });

  useResizeObserver(triggerRef, onResize);
  useMutationObserver(triggerRef, onResize, {
    childList: true,
  });

  return contextRef.current;
}
