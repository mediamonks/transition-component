import {
  bind,
  bindTemplate,
  defineComponent,
  onMounted,
  ref,
  refComponent,
  shallowRef,
} from '@muban/muban';
import { html } from '@muban/template';
// eslint-disable-next-line import/no-extraneous-dependencies
import ScrollTrigger from 'gsap/ScrollTrigger';
import { findTransitionController } from '@mediamonks/muban-transition-component';
import type { TransitionController } from '@mediamonks/muban-transition-component';
import { Foo } from './components/foo/Foo';
import { Scroll } from './components/scroll/Scroll';

export const App = defineComponent({
  name: 'app',
  components: [Scroll],
  refs: {
    transitionInButton: 'transition-in-button',
    transitionOutButton: 'transition-out-button',
    events: 'events',
    foo: refComponent(Foo, {
      ref: 'foo',
    }),
  },
  setup({ refs }) {
    const transitionController = shallowRef<TransitionController | undefined>(undefined);
    const events = ref<Array<{ value: string; time: string }>>([]);

    const addEvent = (event: string): void => {
      events.value = [...events.value, { value: event, time: new Date().toISOString() }];
      setTimeout(() => ScrollTrigger.refresh(), 0);
    };

    const eventListeners = {
      onStart: () => addEvent('onStart'),
      onComplete: () => addEvent('onComplete'),
    };

    onMounted(() => {
      transitionController.value = findTransitionController(refs.foo);
      transitionController.value?.transitionIn(eventListeners);
    });

    return [
      bindTemplate(
        refs.events,
        () => html`<table class="table">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Event</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${events.value.map(
              (event, index) => html`<tr>
                <td>${index + 1}</td>
                <td><span class="badge bg-success">${event.value}</span></td>
                <td class="font-monospace">${event.time}</td>
              </tr>`,
            )}
          </tbody>
        </table>`,
        { forceImmediateRender: true },
      ),
      bind(refs.transitionInButton, {
        event: {
          click: () => transitionController.value?.transitionIn(eventListeners),
        },
      }),
      bind(refs.transitionOutButton, {
        event: {
          click: () => transitionController.value?.transitionOut(eventListeners),
        },
      }),
    ];
  },
});
