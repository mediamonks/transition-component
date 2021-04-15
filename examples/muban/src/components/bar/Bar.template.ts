import { html } from '@muban/template';

export function barTemplate(ref?: string): string {
  return html`<div data-component="bar" data-ref=${ref}>
    <span class="badge bg-info component-label">bar-component</span>
    <h3 data-ref="title" class="mt-3">Hi I'm am the <strong>Bar</strong> component! 👋</h3>
  </div>`;
}
