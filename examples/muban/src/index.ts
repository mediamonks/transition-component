import { createApp } from '@muban/muban';
import { App } from './App';
import { appTemplate } from './App.template';

const app = createApp(App);
// eslint-disable-next-line no-restricted-properties
const element = document.querySelector<HTMLElement>('#app');

if (element) {
  app.mount(element, appTemplate);
}
