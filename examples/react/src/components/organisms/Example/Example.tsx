import { ReactElement, ReactNode, useMemo } from 'react';
import { Paragraph } from '../../atoms/Paragraph/Paragraph';
import { StyledCaption, StyledExample } from './Example.styles';

interface ExampleProps {
  // The id of the codesandbox to embed
  id: string;

  // Start with the devtools (console) open
  expandDevTools?: boolean;

  // Hide the DevTools bar of the preview
  hideDevTools?: boolean;

  // Hide the navigation bar of the preview
  hideNavigation?: boolean;

  // Which lines to highlight
  highlights?: ReadonlyArray<number>;

  // Which url to initially load in address bar string /
  initialPath?: string;

  // Which module to open by default. Multiple paths comma separated are allowed, in that case we show them as tabs path to module (starting with /) entry path
  module?: ReadonlyArray<string>;

  // Evaluate the file that is open in the editor
  moduleView?: boolean;

  // Which preview window to open by default console/tests/browser browser
  previewWindow?: 'console' | 'tests' | 'browser';

  // Only load the preview when the user says so
  runOnClick?: boolean;

  // Which view to open by default
  view?: 'editor' | 'split' | 'preview';

  caption?: ReactNode;
}

/**
 *
 * @param props
 * @returns
 */
export function Example({
  id,
  expandDevTools,
  hideDevTools = true,
  hideNavigation = true,
  highlights,
  initialPath,
  module = ['/src/index.js'],
  moduleView,
  previewWindow,
  runOnClick = true,
  view = 'preview',
  caption,
}: ExampleProps): ReactElement {
  const src = useMemo(() => {
    const url = new URL('https://codesandbox.io/');

    url.pathname = `/embed/${id}`;

    /**
     * Use code mirror to decrease embed size significantly
     */
    url.searchParams.set('codemirror', '1');

    if (expandDevTools != null) {
      url.searchParams.set('expanddevtools', expandDevTools ? '1' : '0');
    }

    if (hideDevTools != null) {
      url.searchParams.set('hidedevtools', hideDevTools ? '1' : '0');
    }

    if (hideNavigation != null) {
      url.searchParams.set('hidenavigation', hideNavigation ? '1' : '0');
    }

    if (highlights != null) {
      url.searchParams.set('highlights', highlights.join(','));
    }

    if (initialPath != null) {
      url.searchParams.set('initialpath', initialPath);
    }

    if (module != null) {
      url.searchParams.set('module', module.join(','));
    }

    if (moduleView != null) {
      url.searchParams.set('moduleview', moduleView ? '1' : '0');
    }

    if (previewWindow != null) {
      url.searchParams.set('previewwindow', previewWindow);
    }

    if (runOnClick != null) {
      url.searchParams.set('runonclick', runOnClick ? '1' : '0');
    }

    if (view != null) {
      url.searchParams.set('view', view);
    }

    return url.href;
  }, [
    expandDevTools,
    hideDevTools,
    hideNavigation,
    highlights,
    initialPath,
    module,
    moduleView,
    previewWindow,
    runOnClick,
    view,
  ]);

  return (
    <StyledExample>
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '45vh',
          minHeight: 400,
          border: 0,
          borderRadius: 4,
          overflow: 'hidden',
        }}
        allow="accelerometer"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>

      <StyledCaption>{caption}</StyledCaption>
    </StyledExample>
  );
}
