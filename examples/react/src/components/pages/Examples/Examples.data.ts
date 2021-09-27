import dedent from 'dedent';

export const codeSample = `
import {
  TransitionPresence,
  unwrapRefs,
  useEnterTransition,
  useLeaveTransition,
  useTransitionController,
} from '@mediamonks/react-transition-component';

function ComponentOne() {
  const divRef = React.useRef<HTMLDivElement>(null);

  const transitionController = useTransitionController(() => ({
    refs: {
      divRef,
    },
    setupTransitionInTimeline(timeline, refs) {
      const { divRef } = unwrapRefs(refs)

      timeline.fromTo(divRef, {
        x: 0,
        y: 0,
      }, {
        x: 50,
        y: 0,
        duration: 2,
      })
    }
  }))

  useEnterTransition(transitionController);
  useLeaveTransition(transitionController);

  return <div ref={divRef}>ComponentOne</div>
}

function ComponentTwo() {
  const [show, toggleShow] = useToggle();

  return (
    <TransitionPresence>
      {show ? <ComponentOne /> : null}
    </TransitionPresence>
  )
}`;
