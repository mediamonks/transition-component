import { createApp, type App } from '@muban/muban';
import { type Decorator } from '@storybook/react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { App as MubanApp } from './App';

export const LayoutContext = createContext<App | undefined>(undefined);

export function useLayoutContext(): App | undefined {
  return useContext(LayoutContext);
}

export type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps): ReactElement {
  const [app, setApp] = useState<App>();

  useEffect(() => {
    const _app = createApp(MubanApp);
    setApp(_app);

    _app.mount(document.body);
  }, []);

  return (
    <LayoutContext.Provider value={app}>
      <div data-component="app">{children}</div>
    </LayoutContext.Provider>
  );
}

export const layoutDecorator: Decorator = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Story,
) => (
  <Layout>
    <Story />
  </Layout>
);
