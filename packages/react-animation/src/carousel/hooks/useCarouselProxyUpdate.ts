import { useEffect } from 'react';
import { ProxyUpdateEvent, type CarouselContext } from './useCarousel.js';

export function useCarouselProxyUpdate(carousel: CarouselContext, callback: () => void): void {
  useEffect(() => {
    carousel.proxyRef.current?.addEventListener(ProxyUpdateEvent.type, callback);

    return () => {
      carousel.proxyRef.current?.removeEventListener(ProxyUpdateEvent.type, callback);
    };
  }, [callback, carousel.proxyRef]);
}
