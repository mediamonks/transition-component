import {
  bind,
  bindTemplate,
  computed,
  defineComponent,
  onMounted,
  ref,
  refComponent,
  shallowRef,
} from '@muban/muban';
import { useGlobalTransitionContext } from '@mediamonks/muban-transition-component';
import { html } from '@muban/template';
import type { TransitionController } from '@mediamonks/core-transition-component';
import { Foo } from './components/foo/Foo';


export const App = defineComponent({
  name: 'app',
  refs: {
    transitionInButton: 'transition-in-button',
    transitionOutButton: 'transition-out-button',
    events: 'events',
    foo: refComponent(Foo, {
      ref: 'foo',
    }),
  },
  setup({ refs }) {
    const transitionContext = useGlobalTransitionContext();
    const transitionController = shallowRef<TransitionController | null>(null);
    const events = ref<Array<{ value: string; time: string }>>([]);

    const eventListeners = {
      onStart: () => {
        events.value = [...events.value, { value: 'onStart', time: new Date().toISOString() }];
      },
      onComplete: () => {
        events.value = [...events.value, { value: 'onComplete', time: new Date().toISOString() }];
      },
    };

    onMounted(() => {
      transitionController.value = transitionContext.getController(refs.foo);
      transitionController.value.transitionIn(eventListeners);
    });

    return [
      bindTemplate(
        refs.events,
        computed(() => ({ events: events.value })),
        (data) => html`<table class="table">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Event</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${data.events.map(
              (event, index) => html`<tr>
                <td>${index + 1}</td>
                <td><span class="badge bg-success">${event.value}</span></td>
                <td class="font-monospace">${event.time}</td>
              </tr>`,
            )}
          </tbody>
        </table>`,
        { renderImmediate: true },
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
