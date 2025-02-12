/** @jsx h */
import { h } from '../h';

export class TextBox {
    private inputRef: HTMLInputElement | null = null;

    getText(): string {
        return this.inputRef ? this.inputRef.value.trim() : '';
    }

    clear() {
        if (this.inputRef) {
            this.inputRef.value = '';
        }
    }

    append(text: string) {
        if (this.inputRef) {
            this.inputRef.value += text;
        }
    }

    render(): JSX.Element {
        return (
            <input 
                type="text" 
                ref={(el:any) => (this.inputRef = el)}
                placeholder="Type text here..."
                style="padding: 8px; flex: 1; border: 1px solid #ddd;"
            />
        );
    }
}
