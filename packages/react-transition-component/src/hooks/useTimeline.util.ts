import gsap from 'gsap';

export type TransitionConfig = {
  decorateTimeline: (timeline: gsap.core.Timeline) => gsap.core.Timeline;
  timelineVariables?: () => gsap.TimelineVars;
};

export function createTimelines(
  transitionConfigs: Set<TransitionConfig>,
): ReadonlyArray<gsap.core.Timeline> {
  return Array.from(transitionConfigs).map(({ decorateTimeline, timelineVariables }) => {
    const timeline = gsap.timeline({
      ...timelineVariables?.(),
      paused: true,
    });

    decorateTimeline(timeline);

    return timeline.play();
  });
}

export function killTimelines(timelines: ReadonlyArray<gsap.core.Timeline>): void {
  timelines.forEach((timeline) => timeline.kill());
}
