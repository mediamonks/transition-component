import gsap from 'gsap';
import type { TransitionDirection } from '../types/transition.types';

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

  if (direction === 'in' && !child.vars.startAt) {
    throw new Error('Do not use from while nesting transitionInTimelines, use fromTo instead!');
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

export function cloneTimeline(
  source: gsap.core.Timeline,
  direction: TransitionDirection,
): gsap.core.Timeline {
  const timeline = gsap.timeline(source.vars);

  source.getChildren(false).forEach((child) => parseChild(child, timeline, direction));

  return timeline;
}

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
