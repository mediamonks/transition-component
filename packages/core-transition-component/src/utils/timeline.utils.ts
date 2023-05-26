import gsap from 'gsap';
import type { TransitionDirection } from '../types/transition.types.js';

export function parseChild(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  child: gsap.core.Timeline | gsap.core.Tween,
  timeline: gsap.core.Timeline,
  direction: TransitionDirection,
): void {
  if ('getChildren' in child) {
    parseChildTimeline(child, timeline, direction);
  } else {
    parseChildTween(child as gsap.core.Tween, timeline, direction);
  }
}

function parseChildTimeline(
  child: gsap.core.Timeline,
  timeline: gsap.core.Timeline,
  direction: TransitionDirection,
): void {
  const subTimeline = gsap.timeline(child.vars);

  // Re-call the parse method for each of the children
  // eslint-disable-next-line no-underscore-dangle
  for (const _child of child.getChildren(false)) {
    parseChild(_child, subTimeline, direction);
  }

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

  if (
    direction === 'in' &&
    // When nesting a timeline we should either have a `startAt` or a function target defined.
    !child.vars.startAt &&
    !child.targets().some((target) => typeof target === 'function')
  ) {
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

  for (const child of source.getChildren(false)) {
    parseChild(child, timeline, direction);
  }

  return timeline;
}

export function clearTimeline(timeline: gsap.core.Timeline, isRoot = true): void {
  for (const child of timeline.getChildren()) {
    if ('getChildren' in child) {
      clearTimeline(child, false);
    } else {
      gsap.set(child.targets(), { clearProps: 'all' });
    }
  }

  timeline.clear();

  // Make sure the main timeline is still paused after clearing it.
  if (isRoot) {
    timeline.pause(0);
  }
}
