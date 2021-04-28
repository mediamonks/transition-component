import { html } from '@muban/template';
import { barTemplate } from '../bar/Bar.template';

export function fooTemplate(ref?: string): string {
  return html`
    <div data-component="foo" data-ref=${ref}>
      <span class="badge bg-primary component-label">foo-component</span>
      ${barTemplate('bar')}
    </div>
  `;
}
