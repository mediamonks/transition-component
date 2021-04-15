import { html } from '@muban/template';
import { fooTemplate } from './components/foo/Foo.template';

export function appTemplate(): string {
  return html`<section data-component="app">
    <span class="badge bg-danger component-label">app-component</span>
    ${fooTemplate('foo')}
    <div class="container mt-5">
      <div class="row">
        <div class="col-3">
          <h4>Controls</h4>
          <div class="btn-group" role="group" aria-label="Basic outlined example">
            <button type="button" class="btn btn-outline-primary" data-ref="transition-in">
              Transition In
            </button>
            <button type="button" class="btn btn-outline-primary" data-ref="transition-out">
              Transition Out
            </button>
          </div>
        </div>
        <div class="col">
          <h4>Events</h4>
          <div class="container bg-dark text-light p-3" data-ref="events">
            <span class="badge bg-warning">TODO</span> Display transition events
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
