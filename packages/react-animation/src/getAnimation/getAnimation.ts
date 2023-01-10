import { animations } from '../animations.js';

/**
 * Tries to get animation from global animations map for given reference
 */
export function getAnimation(reference: unknown): gsap.core.Animation | undefined {
  return animations.get(reference);
}
