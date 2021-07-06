import { html } from '@muban/template';
import { fooTemplate } from './components/foo/Foo.template';
import { scrollTemplate } from './components/scroll/Scroll.template';

export function appTemplate(): string {
  return html`
    <section data-component="app">
      <span class="badge bg-danger component-label">app-component</span>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2>Basic</h2>
            <p class="fs-7 col-md-8">
              See the following example of nested components with the controls to trigger the
              transition-in and transition-out methods.
            </p>
          </div>
        </div>
      </div>
      <div>${fooTemplate('foo')}</div>
      <div class="container mt-5">
        <div class="row">
          <div class="col-3">
            <h4>Controls</h4>
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button type="button" class="btn btn-outline-primary" data-ref="transition-in-button">
                Transition In
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                data-ref="transition-out-button"
              >
                Transition Out
              </button>
            </div>
          </div>
          <div class="col">
            <h4>Events</h4>
            <div
              class="container p-0"
              data-ref="events"
              style="max-height: 400px; overflow-y:auto;"
            >
              <!-- This will be replaced with bindings -->
            </div>
          </div>
        </div>
      </div>
      <div class="container mt-5">
        <h2>onScroll</h2>
        <p>See the following components transition-in when they enter the viewport.</p>
        ${Array.from({ length: 20 }).map(() => scrollTemplate())}
      </div>
    </section>
  `;
}
