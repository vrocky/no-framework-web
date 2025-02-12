/** @jsx h */
import { h } from './h';
import { Panel } from './components/Panel';

export class App {
    private rootElement: HTMLElement | null = null;

    setRoot(element: HTMLElement) {
        this.rootElement = element;
    }

    render(): JSX.Element {
        return <Panel />;
    }
}
