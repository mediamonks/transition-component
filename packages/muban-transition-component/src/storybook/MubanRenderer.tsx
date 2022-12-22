import { type ComponentFactory } from '@muban/muban';
import { useEffect, type ReactElement } from 'react';
import { useLayoutContext } from './Layout';

export type MubanRendererProps = {
  component: ComponentFactory;
  markup: string;
};

export function MubanRenderer({ component, markup }: MubanRendererProps): ReactElement {
  const app = useLayoutContext();

  useEffect(() => {
    app?.component(component);
  }, [app, component]);

  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __html: markup,
      }}
    />
  );
}
