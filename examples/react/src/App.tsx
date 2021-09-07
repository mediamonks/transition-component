import {
  Redirect,
  Route,
  Switch,
  TransitionPersistence,
  TransitionRouter,
  useTransitionController,
  useTransitionControllerRef,
} from '@mediamonks/react-transition-component';
import React, { ReactNode, useRef, useState } from 'react';

interface MyTransitionComponentProps {
  children: ReactNode;
  transitionRef?: Symbol;
}

function MyTransitionComponent({ children, transitionRef = Symbol() }: MyTransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useTransitionController(
    {
      ref: transitionRef,
      setupTransitionInTimeline(timeline: any) {
        timeline.fromTo(
          divRef.current,
          {
            x: 100,
            scale: 0.6,
          },
          {
            x: 0,
            scale: 1,
          },
        );

        return timeline;
      },

      setupTransitionOutTimeline(timeline: any) {
        timeline.to(divRef.current, {
          x: 0,
          scale: 1.5,
          rotate: 920,
          duration: 4,
        });

        return timeline;
      },
    },
    [divRef],
  );

  return (
    <div
      ref={divRef}
      style={{
        width: 200,
        height: 200,
        background: 'red',
        margin: 20,
      }}
    >
      {children}
    </div>
  );
}

function App() {
  const [show, setShow] = useState(false);

  const { transitionController, ref } = useTransitionControllerRef();

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle TransitionPersistence</button>

      <TransitionPersistence>
        {/**
         * Transition out is started before the element is actually removed from the v-dom
         */}
        {show && <MyTransitionComponent>TransitionPersistence</MyTransitionComponent>}
      </TransitionPersistence>

      <button onClick={() => transitionController?.transitionIn()}>TransitionIn</button>
      <button onClick={() => transitionController?.transitionIn()}>TransitionOut</button>

      <MyTransitionComponent transitionRef={ref}>
        Control transition from parent
      </MyTransitionComponent>

      {/**
       * Custom history is used in the TransitionRouter so that history
       * changes can be blocked until out transitions is finished.
       */}
      <TransitionRouter>
        <Switch>
          <Route path="/a">
            <MyTransitionComponent>Page a</MyTransitionComponent>
          </Route>

          <Route path="/b">
            <MyTransitionComponent>Page b</MyTransitionComponent>
          </Route>

          <Redirect to="/a" />
        </Switch>
      </TransitionRouter>
    </>
  );
}

export default App;
