import gsap from 'gsap';
import type { TransitionDirection } from '../types/transition.types';

/**
 * This method is used to recursively clone timelines, we need to differentiate them because a timeline can contain
 * another timeline as well and in that scenario we need to parse it a little differently.
 *
 * @param child
 * @param timeline
 * @param direction
 */
function parseChild(
  child: gsap.core.Timeline | gsap.core.Tween,
  timeline: gsap.core.Timeline,
  direction: TransitionDirection,
): void {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  if ('getChildren' in child) {
    parseChildTimeline(child, timeline, direction);
  } else {
    parseChildTween(child as gsap.core.Tween, timeline, direction);
  }
  /* eslint-enable */
}

/**
 * When one of the child elements is another timeline we can simply create a new timeline and add all the child
 * animations to that specific timeline. This way we can ensure that the timeline is an actual clone and has no references
 * to the original timeline.
 *
 * @param child
 * @param timeline
 * @param direction
 */
function parseChildTimeline(
  child: gsap.core.Timeline,
  timeline: gsap.core.Timeline,
  direction: TransitionDirection,
): void {
  const subTimeline = gsap.timeline(child.vars);

  // Re-call the parse method for each of the children
  // eslint-disable-next-line no-shadow
  child.getChildren(false).forEach((child) => parseChild(child, subTimeline, direction));

  // Add the timeline to the parent timeline
  timeline.add(subTimeline.restart(), child.startTime());
}

/**
 * When one of the child elements is a Tween we can simply create a clone of that tween to the cloned timeline, this way
 * we can also ensure the new tween has nothing in common with the original tween.
 * @param child
 * @param timeline
 * @param direction
 */
function parseChildTween(
  child: gsap.core.Tween,
  timeline: gsap.core.Timeline,
  direction: TransitionDirection,
): void {
  if (direction === 'out' && child.vars.startAt) {
    throw new Error(
      'Do not use `from` or `fromTo` when nesting transitionOutTimelines, use `to` instead!',
    );
  }

  if (
    direction === 'in' &&
    !child.vars.startAt &&
    !child.vars.onComplete &&
    !child.vars.onReverseComplete
  ) {
    throw new Error('Do not use `from` while nesting transitionInTimelines, use `fromTo` instead!');
  }

  const { startAt: from, ...to } = child.vars;
  const targets = child.targets();
  const startTime = child.startTime();

  if (from) {
    // Detect if we have a `fromTo-animation`, if so add a copy to the new timeline.
    timeline.fromTo(targets, from, to, startTime);
  } else if (child.vars.runBackwards) {
    timeline.from(targets, child.vars, startTime);
  } else {
    timeline.to(targets, child.vars, startTime);
  }
}

/**
 * This method creates a deep clone of a provided timeline, it will recursively loop through all the timeline children
 * and clone every animation and sub-timeline to a new timeline.
 *
 * @param source
 * @param direction
 */
export function cloneTimeline(
  source: gsap.core.Timeline | undefined,
  direction: TransitionDirection,
): gsap.core.Timeline | undefined {
  if (source === undefined) return undefined;
  const timeline = gsap.timeline(source.vars);

  source.getChildren(false).forEach((child) => parseChild(child, timeline, direction));

  return timeline;
}

/**
 * This method allows you to easily clear a timeline and remove all of the inline styles that have been added by a timeline.
 *
 * @param timeline
 * @param isRoot
 */
export function clearTimeline(timeline: gsap.core.Timeline, isRoot: boolean = true): void {
  timeline.getChildren().forEach((child) => {
    if ('getChildren' in child) {
      clearTimeline(child, false);
    } else {
      gsap.set(child.targets(), { clearProps: 'all' });
    }
  });

  timeline.clear();

  // Make sure the main timeline is still paused after clearing it.
  if (isRoot) timeline.pause(0);
}
