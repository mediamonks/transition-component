import { ReactElement, ReactNode, useEffect, useState } from 'react';

type CanvasProps = {
  children: ReactNode;
  height?: string | number;
};

export function Canvas({ children }: CanvasProps): ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      // Wait with mounting for 3 ticks to make sure the docs page is loaded
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));

      setMounted(true);
    })();
  }, []);

  return (
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        boxShadow: 'rgb(0 0 0 / 20%) 0 2px 5px 0',
        marginBlock: '1em',
        padding: '1em',
        position: 'relative',
      }}
    >
      {mounted && children}
    </div>
  );
}
