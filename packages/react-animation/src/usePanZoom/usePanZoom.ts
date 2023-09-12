/* eslint-disable no-mixed-operators */
import {
  useEventListener,
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
import { getDistanceBetweenTouches } from './util/getDistanceBetweenTouches.js';

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
  position: { x: number; y: number };
  zoomTo?(x: number, y: number, scale?: number): void;
};
export type UsePanZoomOptions = {
  variables?: {
    min: number;
    max: number;
    scaleFactor: number;
    dblClickZoom: number;
  };
  element: MutableRefObject<HTMLElement | null>;
  onMount?(draggable: Draggable): void;
};

export const usePanZoom = (
  container: MutableRefObject<HTMLElement | null>,
  { element, variables }: UsePanZoomOptions,
): PanZoomContext => {
  const proxy = useMemo(() => globalThis.document.createElement('div'), []);
  const [originalSize, setOriginalSize] = useState<Pick<DOMRect, 'width' | 'height'>>({
    width: 10,
    height: 0,
  });
  const { scaleFactor = 1.1, min = 1, max = 15, dblClickZoom = 7 } = variables ?? {};
  const initialDistance = useRef(0);
  const proxyRef = useRefValue(proxy);
  const contextRef = useRef<PanZoomContext>({
    proxyRef,
    zoomValue: 1,
    zoomFactor: scaleFactor,
    oldZoom: 1,
    position: { x: 0, y: 0 },
  });

  const draggable = useDraggable(element, {
    variables: {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: container.current?.getBoundingClientRect() ?? null,
      throwProps: true,
      onDragEnd: () => {
        contextRef.current.position = {
          x: draggable.current?.x ?? 0,
          y: draggable.current?.y ?? 0,
        };
      },
    },
    onMount: () => {
      onBoundsUpdate();
    },
  });

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
        width: originalSize.width * zoomValue,
        height: originalSize.height * zoomValue,
      };
    },
    [originalSize, container, element],
  );

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
      width: containerWidth - dx * 2,
      height: containerHeight - dy * 2,
    };

    draggable.current?.applyBounds(bounds);
    draggable.current?.update();
  }, [draggable, element, container]);

  const applyZoomValue = useCallback(
    (clientX: number, clientY: number) => {
      const zoomDelta = contextRef.current.zoomValue - contextRef.current.oldZoom;
      const { width, height, x, y } = getZoomProps(
        clientX,
        clientY,
        contextRef.current.zoomValue,
        zoomDelta,
      );

      contextRef.current.oldZoom = contextRef.current.zoomValue;
      contextRef.current.position = { x, y };

      // Change scale to just increase width/height
      gsap.set(element.current, {
        x,
        y,
        width,
        height,
      });
      onBoundsUpdate();
    },
    [getZoomProps, onBoundsUpdate, element],
  );

  const zoomTo = useCallback(
    (x: number, y: number, scale = 1.5) => {
      gsap.killTweensOf(element.current);
      contextRef.current.oldZoom = contextRef.current.zoomValue;
      gsap.to(contextRef.current, {
        zoomValue: scale,
        onUpdate: () => {
          applyZoomValue(x, y);
        },
      });
    },
    [element, applyZoomValue],
  );

  contextRef.current.zoomTo = zoomTo;

  useMount(() => {
    const { x = 0, y = 0 } = element.current?.getBoundingClientRect() ?? {};
    contextRef.current.position = { x, y };
    setOriginalSize(
      container.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
      },
    );
  });

  const onResize = useRafCallback(() => {
    onBoundsUpdate();
  });

  const handleTouchStart = useCallback((event: Event) => {
    const touchEvent = event as TouchEvent;
    if (touchEvent.touches.length === 2) {
      initialDistance.current = getDistanceBetweenTouches(touchEvent);
    }
  }, []);

  const handleTouchMove = useCallback(
    (event: Event) => {
      const touchEvent = event as TouchEvent;
      if (touchEvent.touches.length === 2) {
        const distance = getDistanceBetweenTouches(touchEvent);
        const { clientHeight = 0, clientWidth = 0 } = element.current ?? {};

        const { touches } = touchEvent;
        const { position, zoomValue } = contextRef.current;
        const scale = (distance / initialDistance.current) * zoomValue;

        const width = originalSize.width * scale;
        const height = originalSize.height * scale;

        const midPointX = (touches[0].clientX + touches[1].clientX) / 2;
        const midPointY = (touches[0].clientY + touches[1].clientY) / 2;

        const dx = (width - clientWidth) * ((midPointX - position.x) / clientWidth);
        const dy = (height - clientHeight) * ((midPointY - position.y) / clientHeight);

        const x = position.x - dx;
        const y = position.y - dy;

        gsap.set(element.current, {
          width: originalSize.width * scale,
          height: originalSize.height * scale,
          x,
          y,
        });
        onBoundsUpdate();
      }
    },
    [element, onBoundsUpdate, originalSize],
  );

  const handleTouchEnd = useCallback(
    (event: Event) => {
      const touchEvent = event as TouchEvent;
      if (touchEvent.touches.length < 2) {
        const { x = 0, y = 0, width = 0 } = element.current?.getBoundingClientRect() ?? {};

        initialDistance.current = 0;
        contextRef.current.zoomValue = width / originalSize.width;
        contextRef.current.position = { x, y };
      }
    },
    [element, originalSize],
  );

  const handleDoubleClick = useCallback(
    (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const { clientX, clientY } = mouseEvent;
      zoomTo(clientX, clientY, dblClickZoom);
    },
    [dblClickZoom, zoomTo],
  );

  useResizeObserver(container, onResize);

  useEventListener(container, 'wheel', (event: any) => {
    event.preventDefault();

    const { deltaY, clientX, clientY } = event;
    const wheel = deltaY / 100;
    if (wheel > 0) {
      contextRef.current.zoomValue /= contextRef.current.zoomFactor;
    } else {
      contextRef.current.zoomValue *= contextRef.current.zoomFactor;
    }

    contextRef.current.zoomValue = gsap.utils.clamp(min, max, contextRef.current.zoomValue);

    applyZoomValue(clientX, clientY);
  });

  useEventListener(element, 'touchstart', handleTouchStart);
  useEventListener(element, 'touchmove', handleTouchMove);
  useEventListener(element, 'touchend', handleTouchEnd);
  useEventListener(element, 'dblclick', handleDoubleClick);

  return contextRef.current;
};
