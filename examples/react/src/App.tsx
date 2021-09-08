import {
  TransitionControllerRef,
  TransitionPersistence,
  TransitionRouter,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import { createBrowserHistory } from 'history';
import React, { ReactNode, useRef, useState } from 'react';
import { Link, Route } from 'react-router-dom';

interface MyTransitionComponentProps {
  children: ReactNode;
  transitionRef?: TransitionControllerRef;
}

const history = createBrowserHistory();

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
          duration: 1,
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
       * Custom history is used in the TransitionRouter so transition happens before transition
       */}
      <TransitionRouter history={history}>
        <Route path="/page1" exact>
          <MyTransitionComponent>
            <Link to="/page2">Page 1</Link>
          </MyTransitionComponent>
        </Route>

        <Route path="/page2" exact>
          <MyTransitionComponent>
            <Link to="/">Page 2</Link>
          </MyTransitionComponent>
        </Route>

        <Route path="/" exact>
          <MyTransitionComponent>
            <Link to="/page1">Page 0</Link>
          </MyTransitionComponent>
        </Route>
      </TransitionRouter>
    </>
  );
}

export default App;
