import {
  createTransitionHistory,
  TransitionPresence,
} from '@mediamonks/react-transition-component';
import { createBrowserHistory } from 'history';
import { useState } from 'react';
import { Route, Router } from 'react-router-dom';
import { StyledNav, StyledNavLink } from './App.styles';
import { MyTransitionComponent } from './components/atoms/MyTransitionComponent/MyTransitionComponent';
import About from './components/pages/About/About';
import Home from './components/pages/Home/Home';
import { Path } from './routes/Path';

const history = createTransitionHistory(createBrowserHistory());

function App() {
  const [show, setShow] = useState(false);

  return (
    <Router history={history}>
      <StyledNav>
        <div>
          <StyledNavLink to={Path.Home}>Home</StyledNavLink>
          <StyledNavLink to={Path.About}>About</StyledNavLink>
        </div>
        <button onClick={() => setShow(!show)}>Toggle TransitionPresence</button>
      </StyledNav>

      <TransitionPresence>
        {show && <MyTransitionComponent>TransitionPresence</MyTransitionComponent>}
      </TransitionPresence>

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
