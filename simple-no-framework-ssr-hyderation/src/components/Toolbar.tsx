/** @jsx h */
import { h } from '../h';
import { EventEmitter, Disposable } from '../utils/events';

export class Toolbar {
    private readonly _onClick = new EventEmitter<void>();

    onDidClick(callback: () => void): Disposable {
        return this._onClick.on(callback);  // Pass the callback directly
    }

    render(): JSX.Element {
        return (
            <button 
                onClick={() => this._onClick.fire()}  
                style="
                    padding: 8px 16px;
                    background: #0078d4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                "
            >
                Add
            </button>
        );
    }

    dispose(): void {
        this._onClick.dispose();
    }
}
