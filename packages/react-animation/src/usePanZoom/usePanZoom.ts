import {
  useEventListener,
  useIsMounted,
  useMount,
  useRafCallback,
  useRefValue,
  useResizeObserver,
} from '@mediamonks/react-hooks';
import gsap from 'gsap';
import {
  useRef,
  type MutableRefObject,
  type RefObject,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { useDraggable } from '../index.js';

/**
 * Omitting all callback properties, use event listener instead.
 *
 * @example
 * useEventListener(draggable, 'drag', (event) => {
 *   console.log(event);
 * })
 */
export type DraggableVariables = Draggable.Vars;

export type PanZoomContext = {
  draggable?: RefObject<Draggable | null>;
  proxyRef: RefObject<HTMLDivElement | null>;
  zoomValue: number;
  zoomFactor: number;
  oldZoom: number;
  zoomTo?(x: number, y: number, scale?: number): void;
};
export type UsePanZoomOptions = {
  variables?: { min: number; max: number; scaleFactor: number; acceleration: number };
  element: MutableRefObject<HTMLElement | null>;
  onMount?(draggable: Draggable): void;
};

export const usePanZoom = (
  container: MutableRefObject<HTMLElement | null>,
  {
    element,
    variables: { scaleFactor = 0, min = 0, max = 0, acceleration = 1 } = {
      scaleFactor: 0,
      min: 0,
      max: 0,
      acceleration: 1,
    },
    onMount,
  }: UsePanZoomOptions,
): PanZoomContext => {
  const proxy = useMemo(() => globalThis.document?.createElement('div') ?? null, []);
  const [originalSize, setOriginalSize] = useState<Pick<DOMRect, 'width' | 'height'>>({
    width: 10,
    height: 0,
  });
  const proxyRef = useRefValue(proxy);

  const contextRef = useRef<PanZoomContext>({
    proxyRef,
    zoomValue: 1,
    zoomFactor: 1.1,
    oldZoom: 1,
  });

  // let zoomValue = 1;
  // let zoomfactor = 1.1;
  // let oldZoom = 1;

  const draggable = useDraggable(element, {
    variables: {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: container.current?.getBoundingClientRect() ?? null,
      throwProps: true,
      // onDrag: () => {
      //   onDrag();
      // },
    },
    onMount: () => {
      onBoundsUpdate();
    },
  });

  const zoomTo = useCallback(
    (x: number, y: number, scale = 1.5) => {
      gsap.killTweensOf(element.current);
      gsap.to(element.current, {
        ...getZoomProps(x, y, scale, scale),
        ease: 'expo.out',
        onComplete: onBoundsUpdate,
      });
    },
    [originalSize],
  );

  const getZoomProps = useCallback(
    (_x: number, _y: number, zoomValue = 1.5, zoomDelta = 1) => {
      gsap.killTweensOf(element.current);
      const { oldZoom } = contextRef.current;
      const { left = 0, top = 0 } = container.current?.getBoundingClientRect() ?? {};
      const props = gsap.getProperty(element.current);
      let x = props('x') as number;
      let y = props('y') as number;

      const globalX = _x - left;
      const globalY = _y - top;

      const localX = (globalX - x) / oldZoom;
      const localY = (globalY - y) / oldZoom;

      x += -(localX * zoomDelta);
      y += -(localY * zoomDelta);

      return {
        x,
        y,
        width: originalSize?.width * zoomValue,
        height: originalSize?.height * zoomValue,
      };
    },
    [originalSize],
  );

  contextRef.current.zoomTo = zoomTo;

  const onBoundsUpdate = useCallback(() => {
    const { width: containerWidth = 0, height: containerHeight = 0 } =
      container.current?.getBoundingClientRect() ?? {};
    const { width = 0, height = 0 } = element.current?.getBoundingClientRect() ?? {};

    const scaledWith = width;
    const scaledHeight = height;

    const dx = containerWidth - scaledWith;
    const dy = containerHeight - scaledHeight;

    const bounds = {
      left: dx,
      top: dy,
      width: (containerWidth - dx) * 2,
      height: (containerHeight - dy) * 2,
    };
    draggable.current?.applyBounds(bounds);
    draggable.current?.update();
  }, [draggable]);

  useMount(() => {
    setOriginalSize(
      container.current?.getBoundingClientRect() ?? {
        width: 30,
        height: 0,
      },
    );
  });

  const onResize = useRafCallback(() => {
    onBoundsUpdate();
  });

  useResizeObserver(container, onResize);

  useEventListener(container, 'wheel', (event: any) => {
    event.preventDefault();

    const { deltaY, clientX, clientY } = event;

    contextRef.current.oldZoom = contextRef.current.zoomValue;

    const wheel = deltaY / 100;

    if (wheel > 0) {
      contextRef.current.zoomValue /= contextRef.current.zoomFactor;
    } else {
      contextRef.current.zoomValue *= contextRef.current.zoomFactor;
    }

    contextRef.current.zoomValue = gsap.utils.clamp(1, 15, contextRef.current.zoomValue);

    const zoomDelta = contextRef.current.zoomValue - contextRef.current.oldZoom;

    const zoomProps = getZoomProps(clientX, clientY, contextRef.current.zoomValue, zoomDelta);

    // Change scale to just increase width an
    gsap.set(element.current, {
      // scale: zoomValue,
      // width: originalSize?.width * zoomValue,
      // height: originalSize?.width * zoomValue,
      // x,
      // y,
      // ease: 'ease.none',
      // transformOrigin: 'left top',
      // duration: 0.3,
      ...zoomProps,
    });
    onBoundsUpdate();
  });

  return contextRef.current;
};
