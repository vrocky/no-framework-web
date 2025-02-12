/** @jsx h */
import { h, hydrate } from './h';
import { App } from './App';

const app = new App();
const root = document.getElementById('app');

if (!root) {
    throw new Error('Root element not found');
}

app.setRoot(root);
hydrate(app.render(), root);

