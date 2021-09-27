import { TransitionRoute, TransitionRouter } from '@mediamonks/react-transition-component';
import { createBrowserHistory } from 'history';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { appTheme, GlobalStyle } from './App.styles';
import { Navigation } from './components/organisms/Navigation/Navigation';
import ApiDocumentation from './components/pages/ApiDocumentation/ApiDocumentation';
import Examples from './components/pages/Examples/Examples';
import Home from './components/pages/Home/Home';
import { Path } from './routes/Path';

const history = createBrowserHistory();

function App() {
  const [show, setShow] = useState(false);
  return (
    <TransitionRouter history={history}>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />

        <Navigation />

        <TransitionRoute path={Path.Examples} exact>
          {() => <Examples />}
        </TransitionRoute>
        <TransitionRoute path={Path.ApiDocumentation} exact>
          {() => <ApiDocumentation />}
        </TransitionRoute>
        <TransitionRoute path={Path.Home} exact>
          {() => <Home />}
        </TransitionRoute>
      </ThemeProvider>
    </TransitionRouter>
  );
}

export default App;
