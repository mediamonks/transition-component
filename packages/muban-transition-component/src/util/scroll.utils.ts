type ViewportLeavePosition = 'top' | 'bottom';

let viewportLeaveObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, (position: ViewportLeavePosition) => void>();
const observerPositions = new Map<Element, number>();

// Make sure we only have one intersection observer instance that tracks whether or not something is in the viewport,
// but we still want to be able to polyfill it so create it once it's needed.
function getViewportLeaveObserver(): IntersectionObserver {
  if (!viewportLeaveObserver) {
    viewportLeaveObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const previousY = observerPositions.get(entry.target) ?? 0;
          const callback = observerCallbacks.get(entry.target);

          // Detect if the entry leaves the viewport and where it leaves the viewport
          if (!entry.isIntersecting) {
            callback?.(entry.boundingClientRect.y > previousY ? 'bottom' : 'top');
          }

          observerPositions.set(entry.target, entry.boundingClientRect.y);
        }
      },
      {
        threshold: [0, 1],
      },
    );
  }

  return viewportLeaveObserver;
}

export function addLeaveViewportObserver(
  element: Element,
  onLeaveViewport: (position: ViewportLeavePosition) => void,
): () => void {
  const observer = getViewportLeaveObserver();

  observerCallbacks.set(element, (position) => {
    onLeaveViewport(position);
  });

  observer.observe(element);

  return () => {
    observer.unobserve(element);
    observerCallbacks.delete(element);
    observerPositions.delete(element);
  };
}
