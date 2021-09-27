let defaultScrollTriggerVariables: ScrollTrigger.Vars = {
  start: 'top 75%',
};

export function setDefaultScrollTriggerVariables(scrollTriggerVariables: ScrollTrigger.Vars): void {
  defaultScrollTriggerVariables = scrollTriggerVariables;
}

export function getDefaultScrollTriggerVariables(): ScrollTrigger.Vars {
  return defaultScrollTriggerVariables;
}
