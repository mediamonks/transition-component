/* eslint-disable no-mixed-operators */
export function getDistanceBetweenTouches(event: TouchEvent): number {
  const [touch1, touch2] = event.touches;
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
