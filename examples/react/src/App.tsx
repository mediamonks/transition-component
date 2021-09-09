import {
  createTransitionHistory,
  PersistenceTransition,
  TransitionControllerRef,
  usePersistanceTransitionController,
} from '@mediamonks/react-transition-component';
import { createBrowserHistory } from 'history';
import { ReactNode, useRef, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import { StyledNav, StyledNavLink } from './App.styles';
import About from './components/pages/About/About';
import Home from './components/pages/Home/Home';
import { Path } from './routes/Path';

interface MyTransitionComponentProps {
  children: ReactNode;
  transitionRef?: TransitionControllerRef;
}

const history = createTransitionHistory(createBrowserHistory());

function MyTransitionComponent({ children, transitionRef }: MyTransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  usePersistanceTransitionController(
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
    <Router history={history}>
      <StyledNav>
        <div>
          <StyledNavLink to={Path.Home}>Home</StyledNavLink>
          <StyledNavLink to={Path.About}>About</StyledNavLink>
        </div>
        <button onClick={() => setShow(!show)}>Toggle TransitionPersistence</button>
      </StyledNav>

      <PersistenceTransition>
        {show && <MyTransitionComponent>PersistenceTransition</MyTransitionComponent>}
      </PersistenceTransition>

      <Route path={Path.About} exact>
        <About />
      </Route>

      <Route path={Path.Home} exact>
        <Home />
      </Route>
    </Router>
  );
}

export default App;
