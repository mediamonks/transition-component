import { TransitionRoute } from '@mediamonks/react-transition-component';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import ApiDocumentation from './components/pages/ApiDocumentation/ApiDocumentation';
import Examples from './components/pages/Examples/Examples';
import Home from './components/pages/Home/Home';
import { Path } from './routes/Path';

export function Routes() {
  const location = useLocation();

  useEffect(() => {
    let top = 0;

    if (location.hash) {
      const targetElement = document.querySelector(location.hash) as HTMLElement;

      console.log(targetElement);

      if (targetElement) {
        top = targetElement.offsetTop - window.innerHeight / 20;
      }
    }

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }, [location.pathname, location.hash]);

  return (
    <>
      <TransitionRoute path={Path.Examples} exact>
        {() => <Examples />}
      </TransitionRoute>
      <TransitionRoute path={Path.ApiDocumentation} exact>
        {() => <ApiDocumentation />}
      </TransitionRoute>
      <TransitionRoute path={Path.Home} exact>
        {() => <Home />}
      </TransitionRoute>
    </>
  );
}
