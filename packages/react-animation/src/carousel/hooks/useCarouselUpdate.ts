import { useRefValue, useEventListener } from '@mediamonks/react-hooks';
import { ProxyUpdateEvent, type CarouselContext } from './useCarousel.js';

export function useCarouselUpdate(carousel: CarouselContext, callback: () => void): void {
  const callbackRef = useRefValue(callback);

  useEventListener(carousel.proxyRef.current, ProxyUpdateEvent.type, () => {
    callbackRef.current?.();
  });
}
