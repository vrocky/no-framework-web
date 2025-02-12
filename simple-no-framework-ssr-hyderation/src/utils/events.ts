export type Disposable = {
    dispose: () => void;
};

export type EventHandler<T = void> = (event: T) => void;

export class EventEmitter<T = void> {
    private handlers: EventHandler<T>[] = [];

    fire(event?: T): void {
        this.handlers.forEach(handler => handler(event as T));
    }

    on(handler: EventHandler<T>): Disposable {
        this.handlers.push(handler);
        return {
            dispose: () => {
                const index = this.handlers.indexOf(handler);
                if (index > -1) {
                    this.handlers.splice(index, 1);
                }
            }
        };
    }

    dispose(): void {
        this.handlers = [];
    }
}
