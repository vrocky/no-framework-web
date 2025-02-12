/** @jsx h */
import { h } from '../h';

export class TextArea {
    private textAreaRef: HTMLTextAreaElement | null = null;

    getText(): string {
        return this.textAreaRef ? this.textAreaRef.value : '';
    }

    clear() {
        if (this.textAreaRef) {
            this.textAreaRef.value = '';
        }
    }

    append(text: string) {
        if (this.textAreaRef) {
            const currentPos = this.textAreaRef.selectionStart;
            const currentValue = this.textAreaRef.value;
            this.textAreaRef.value = currentValue.substring(0, currentPos) + text + currentValue.substring(currentPos);
            this.textAreaRef.selectionStart = this.textAreaRef.selectionEnd = currentPos + text.length;
            this.textAreaRef.focus();
        }
    }

    render(): JSX.Element {
        return (
            <textarea
                ref={(el) => (this.textAreaRef = el)}
                placeholder="Your text will appear here..."
                style="padding: 8px; width: 100%; height: 150px; border: 1px solid #ddd; margin-top: 10px; resize: vertical;"
            />
        );
    }
}
