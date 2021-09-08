import {
  Link,
  Redirect,
  Route,
  Switch,
  TransitionControllerRef,
  TransitionPersistence,
  TransitionRouter,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import React, { ReactNode, useRef, useState } from 'react';

interface MyTransitionComponentProps {
  children: ReactNode;
  transitionRef?: TransitionControllerRef;
}

function MyTransitionComponent({ children, transitionRef }: MyTransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline(timeline) {
        timeline
          .set(divRef.current, {
            scale: 0,
          })
          .to(divRef.current, {
            rotation: 45,
            scaleY: 1,
            scaleX: 0.5,
          })
          .to(divRef.current, {
            scale: 1,
            rotation: 0,
          });

        return timeline;
      },
      setupTransitionOutTimeline(timeline) {
        timeline.to(divRef.current, {
          x: 0,
          scale: 1.5,
          rotation: -270,
          duration: 4,
        });

        return timeline;
      },
    }),
    [divRef, transitionRef],
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

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle TransitionPersistence</button>

      <TransitionPersistence>
        {show && <MyTransitionComponent>TransitionPersistence</MyTransitionComponent>}
      </TransitionPersistence>

      {/**
       * Custom history is used in the TransitionRouter so that history
       * changes can be blocked until out transitions is finished.
       */}
      <TransitionRouter>
        <Switch>
          <Route path="/a">
            <Link to="/b">
              <MyTransitionComponent>Page a</MyTransitionComponent>
            </Link>
          </Route>

          <Route path="/b">
            <Link to="/a">
              <MyTransitionComponent>Page b</MyTransitionComponent>
            </Link>
          </Route>

          <Redirect to="/a" />
        </Switch>
      </TransitionRouter>
    </>
  );
}

export default App;
