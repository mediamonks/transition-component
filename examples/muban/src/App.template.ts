import { html } from '@muban/template';
import { fooTemplate } from './components/foo/Foo.template';

export function appTemplate(): string {
  return html`<section data-component="app">
    <span class="badge bg-danger component-label">app-component</span>
    <div style="overflow: hidden">${fooTemplate('foo')}</div>
    <div class="container mt-5">
      <div class="row">
        <div class="col-3">
          <h4>Controls</h4>
          <div class="btn-group" role="group" aria-label="Basic outlined example">
            <button type="button" class="btn btn-outline-primary" data-ref="transition-in-button">
              Transition In
            </button>
            <button type="button" class="btn btn-outline-primary" data-ref="transition-out-button">
              Transition Out
            </button>
          </div>
        </div>
        <div class="col">
          <h4>Events</h4>
          <div class="container p-0" data-ref="events" style="max-height: 400px; overflow-y:auto;">
            <!-- This will be replaced with bindings -->
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
