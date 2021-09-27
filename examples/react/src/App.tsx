import { TransitionRouter } from '@mediamonks/react-transition-component';
import { createBrowserHistory } from 'history';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { appTheme, GlobalStyle } from './App.styles';
import { Navigation } from './components/organisms/Navigation/Navigation';
import { Routes } from './Routes';

const history = createBrowserHistory();

function App() {
  const [show, setShow] = useState(false);
  return (
    <TransitionRouter history={history}>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />

        <Navigation />

        <Routes />
      </ThemeProvider>
    </TransitionRouter>
  );
}

export default App;
