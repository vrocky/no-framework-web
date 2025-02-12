/** @jsx h */
import { h } from '../h';
import { TextBox } from './TextBox';
import { TextArea } from './TextArea';
import { Toolbar } from './Toolbar';
import { Disposable } from '../utils/events';

export class Panel {
    private textBox: TextBox;
    private textArea: TextArea;
    private toolbar: Toolbar;
    private disposables: Disposable[] = [];

    constructor() {
        this.textBox = new TextBox();
        this.textArea = new TextArea();
        this.toolbar = new Toolbar();

        // Register event listener and store disposable
        this.disposables.push(
            this.toolbar.onDidClick(() => {
                const text = this.textBox.getText();
                if (text) {
                    this.textArea.append(text + "\n");
                    this.textBox.clear();
                }
            })
        );
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
        this.toolbar.dispose();
    }

    render(): JSX.Element {
        return (
            <div style="padding: 20px; max-width: 600px; margin: auto;">
                <div style="display: flex; gap: 10px; align-items: start;">
                    {this.textBox.render()}
                    {this.toolbar.render()}
                </div>
                {this.textArea.render()}
            </div>
        );
    }
}
